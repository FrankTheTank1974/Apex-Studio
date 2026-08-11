import express from "express";
import path from "path";
import http from "http";
import https from "https";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { ZstdCodec } from "zstd-codec";

dotenv.config();

// Helper function to robustly fetch HTTP/HTTPS URLs avoiding TLS handshake alerts & 403 bot blocks
function isBlockedOrFailed(status: number, text: string): boolean {
  if (status >= 400) return true;
  if (!text) return true;
  const lower = text.toLowerCase();
  return (
    lower.includes("cf-browser-verification") ||
    lower.includes("<title>just a moment...</title>") ||
    lower.includes("attention required! | cloudflare") ||
    lower.includes("checking your browser before accessing") ||
    lower.includes("cloudflare ray id") ||
    lower.includes("403 forbidden")
  );
}

async function fetchUrlContent(targetUrl: string, maxRedirects = 5): Promise<{ status: number; statusText: string; text: string; finalUrl: string }> {
  let currentUrl = targetUrl;
  let redirects = 0;

  while (redirects < maxRedirects) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(currentUrl);
    } catch {
      throw new Error("Invalid URL format. Please enter a valid webpage URL.");
    }

    const isHttps = parsedUrl.protocol === "https:";
    const httpModule = isHttps ? https : http;

    try {
      const result = await new Promise<{ status: number; statusText: string; text: string; finalUrl: string; redirectUrl?: string }>((resolve, reject) => {
        const options: https.RequestOptions = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || (isHttps ? 443 : 80),
          path: (parsedUrl.pathname || "/") + parsedUrl.search,
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "max-age=0",
            "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124", "Google Chrome";v="124"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
          },
          rejectUnauthorized: false, // Prevents TLS handshake alert 80 errors on strict/legacy SSL servers
        };

        const req = httpModule.request(options, (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            try {
              const nextUrl = new URL(res.headers.location, currentUrl).href;
              return resolve({ status: res.statusCode, statusText: res.statusMessage || "", text: "", finalUrl: currentUrl, redirectUrl: nextUrl });
            } catch {
              // Ignore invalid location
            }
          }

          let body = "";
          res.setEncoding("utf-8");
          res.on("data", (chunk) => { body += chunk; });
          res.on("end", () => {
            resolve({
              status: res.statusCode || 200,
              statusText: res.statusMessage || "OK",
              text: body,
              finalUrl: currentUrl,
            });
          });
        });

        req.on("error", (err) => reject(err));
        req.setTimeout(12000, () => {
          req.destroy(new Error("Request timed out after 12 seconds"));
        });
        req.end();
      });

      if (result.redirectUrl) {
        currentUrl = result.redirectUrl;
        redirects++;
        continue;
      }

      // If direct request returned 403 or Cloudflare challenge, attempt Googlebot header and CORS proxy fallbacks
      if (isBlockedOrFailed(result.status, result.text)) {
        console.log(`Direct fetch returned status ${result.status} or challenge page for ${currentUrl}. Attempting Googlebot & CORS proxy fallbacks...`);
        
        // 1. Try Googlebot User-Agent
        try {
          const gRes = await fetch(currentUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
          });
          if (gRes.ok) {
            const gText = await gRes.text();
            if (gText && gText.length > 50 && !isBlockedOrFailed(gRes.status, gText)) {
              return { status: 200, statusText: "OK (via Googlebot)", text: gText, finalUrl: currentUrl };
            }
          }
        } catch {
          // Ignore
        }

        // 2. Try proxy configs
        const proxyConfigs = [
          { type: "raw", url: `https://api.allorigins.win/raw?url=${encodeURIComponent(currentUrl)}` },
          { type: "json_allorigins", url: `https://api.allorigins.win/get?url=${encodeURIComponent(currentUrl)}` },
          { type: "raw", url: `https://corsproxy.io/?${encodeURIComponent(currentUrl)}` },
          { type: "raw", url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(currentUrl)}` },
          { type: "raw", url: `https://r.jina.ai/${currentUrl}` },
        ];

        for (const cfg of proxyConfigs) {
          try {
            const proxyRes = await fetch(cfg.url, {
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
            });
            if (proxyRes.ok) {
              let proxyText = await proxyRes.text();
              if (cfg.type === "json_allorigins") {
                try {
                  const parsed = JSON.parse(proxyText);
                  proxyText = parsed.contents || "";
                } catch {
                  // ignore JSON parse error
                }
              }
              if (proxyText && proxyText.length > 50 && !isBlockedOrFailed(200, proxyText)) {
                return {
                  status: 200,
                  statusText: "OK (via Proxy)",
                  text: proxyText,
                  finalUrl: currentUrl,
                };
              }
            }
          } catch (proxyErr) {
            console.warn(`Proxy ${cfg.url} failed:`, proxyErr);
          }
        }
      }

      return result;
    } catch (err: any) {
      // Fallback to proxy or fetch if https module request failed
      const proxyConfigs = [
        { type: "raw", url: `https://api.allorigins.win/raw?url=${encodeURIComponent(currentUrl)}` },
        { type: "json_allorigins", url: `https://api.allorigins.win/get?url=${encodeURIComponent(currentUrl)}` },
        { type: "raw", url: `https://corsproxy.io/?${encodeURIComponent(currentUrl)}` },
        { type: "raw", url: `https://r.jina.ai/${currentUrl}` },
      ];

      for (const cfg of proxyConfigs) {
        try {
          const proxyRes = await fetch(cfg.url, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
          });
          if (proxyRes.ok) {
            let proxyText = await proxyRes.text();
            if (cfg.type === "json_allorigins") {
              try {
                const parsed = JSON.parse(proxyText);
                proxyText = parsed.contents || "";
              } catch {
                // ignore
              }
            }
            if (proxyText && proxyText.length > 50 && !isBlockedOrFailed(200, proxyText)) {
              return {
                status: 200,
                statusText: "OK (via Proxy Fallback)",
                text: proxyText,
                finalUrl: currentUrl,
              };
            }
          }
        } catch {
          // ignore
        }
      }

      try {
        const fetchRes = await fetch(currentUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          redirect: "follow",
        });
        const text = await fetchRes.text();
        return {
          status: fetchRes.status,
          statusText: fetchRes.statusText,
          text,
          finalUrl: fetchRes.url || currentUrl,
        };
      } catch (fallbackErr: any) {
        throw new Error(err?.message || fallbackErr?.message || "Failed to establish HTTP connection to target URL");
      }
    }
  }

  throw new Error("Too many HTTP redirects encountered");
}

const app = express();
app.use(express.json({ limit: "20mb" }));

const server = http.createServer(app);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

let zstdSimpleInstance: any = null;
ZstdCodec.run((zstd: any) => {
  zstdSimpleInstance = new zstd.Simple();
});

// Lazy initialization for Gemini AI SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// REST API ROUTES
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Generation Endpoint (Gemini)
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, type } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    const systemInstruction = type === "component"
      ? "You are an expert HTML and Tailwind CSS UI engineer. Return ONLY raw valid HTML code wrapped in a container with modern Tailwind CSS utility classes. Do not wrap in markdown backticks."
      : "You are an expert web development assistant. Return production-ready clean code matching the prompt without preamble.";

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    const cleanCode = text.replace(/^```(html|css|js)?\n/i, "").replace(/\n```$/i, "").trim();

    return res.json({ result: cleanCode });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate AI content" });
  }
});

// AI Smart Image Auto-Tagging & Accessibility Alt-Text Generator
app.post("/api/ai/analyze-image", async (req, res) => {
  try {
    const { imageData, imageName, currentAltText } = req.body;
    const name = imageName || "image.png";

    // Extract base64 if data URI
    let base64Data: string | null = null;
    let mimeType = "image/png";

    if (imageData && typeof imageData === "string" && imageData.startsWith("data:")) {
      const parts = imageData.split(",");
      const match = parts[0].match(/data:(.*?);base64/);
      if (match) {
        mimeType = match[1];
        base64Data = parts[1];
      }
    }

    try {
      const ai = getGeminiClient();
      const contentParts: any[] = [];

      if (base64Data) {
        contentParts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        });
      }

      contentParts.push({
        text: `Analyze this image (Filename: "${name}", Current Alt Text: "${currentAltText || 'None'}").
Provide AI auto-tagging keywords and WCAG 2.1 accessibility alt text suggestions.

Return strictly JSON format matching this schema:
{
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "suggestedAltText": "Clear, concise WCAG-compliant descriptive alt text (max 125 chars)",
  "category": "UI Component" | "Illustration" | "Photograph" | "Icon/Vector" | "Banner" | "Background",
  "accessibilityStatus": "compliant" | "needs-improvement" | "missing",
  "accessibilityTip": "Concise tip for accessibility"
}`,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contentParts.length === 1 ? contentParts[0].text : { parts: contentParts },
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const jsonText = response.text || "{}";
      const parsed = JSON.parse(jsonText);

      return res.json({
        success: true,
        data: {
          tags: parsed.tags || ["Image Asset", "Web Graphics"],
          suggestedAltText: parsed.suggestedAltText || `Illustration representing ${name.replace(/[-_.]/g, ' ')}`,
          category: parsed.category || "UI Component",
          accessibilityStatus: parsed.accessibilityStatus || (currentAltText ? "compliant" : "missing"),
          accessibilityTip: parsed.accessibilityTip || "Ensure alt text succinctly conveys the purpose of the image.",
          analyzedAt: Date.now(),
        },
      });
    } catch (aiErr: any) {
      console.warn("Gemini API call warning in analyze-image, using intelligent smart heuristics fallback:", aiErr?.message);
      
      // Smart Heuristic Fallback
      const cleanName = name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const isSvg = name.endsWith('.svg') || (imageData && imageData.includes('svg'));
      const isIcon = cleanName.toLowerCase().includes('icon') || isSvg;
      
      const tags = isIcon 
        ? ["Vector Graphic", "Icon", "UI Element", "Scalable", "Design"]
        : [cleanName, "Image Asset", "Web Media", "UI Content", "Digital Art"];
      
      const suggestedAlt = isIcon
        ? `Icon graphic for ${cleanName}`
        : `Visual graphic depicting ${cleanName} on the page`;

      return res.json({
        success: true,
        data: {
          tags,
          suggestedAltText: suggestedAlt,
          category: isIcon ? "Icon/Vector" : "UI Component",
          accessibilityStatus: currentAltText ? "compliant" : "missing",
          accessibilityTip: "Alt text should briefly describe content for screen readers.",
          analyzedAt: Date.now(),
        },
      });
    }
  } catch (error: any) {
    console.error("Image Analysis Error:", error);
    return res.status(500).json({ error: error?.message || "Failed to analyze image" });
  }
});

// .tar.zst Archive Generation Route
app.post("/api/export/zst", (req, res) => {
  try {
    const { files, filename = "project-archive" } = req.body;
    if (!Array.isArray(files)) {
      return res.status(400).json({ error: "Files array is required" });
    }

    // Build tar payload
    const blocks: Uint8Array[] = [];
    const encoder = new TextEncoder();

    for (const file of files) {
      const dataBytes = typeof file.content === "string" ? encoder.encode(file.content) : new Uint8Array(file.content);
      const header = new Uint8Array(512);

      const nameBytes = encoder.encode(file.name || "file.txt");
      header.set(nameBytes.subarray(0, 100), 0);

      header.set(encoder.encode("0000644\0"), 100);
      header.set(encoder.encode("0000000\0"), 108);
      header.set(encoder.encode("0000000\0"), 116);

      const sizeOctal = dataBytes.byteLength.toString(8).padStart(11, "0") + "\0";
      header.set(encoder.encode(sizeOctal), 124);

      const mtimeOctal = Math.floor(Date.now() / 1000).toString(8).padStart(11, "0") + "\0";
      header.set(encoder.encode(mtimeOctal), 136);

      header[156] = "0".charCodeAt(0);
      header.set(encoder.encode("ustar\0"), 257);
      header.set(encoder.encode("00"), 263);

      for (let i = 148; i < 156; i++) header[i] = " ".charCodeAt(0);

      let checksum = 0;
      for (let i = 0; i < 512; i++) checksum += header[i];
      const checksumOctal = checksum.toString(8).padStart(6, "0") + "\0 ";
      header.set(encoder.encode(checksumOctal), 148);

      blocks.push(header);
      blocks.push(dataBytes);

      const remainder = dataBytes.byteLength % 512;
      if (remainder > 0) {
        blocks.push(new Uint8Array(512 - remainder));
      }
    }

    blocks.push(new Uint8Array(1024));

    const totalLength = blocks.reduce((acc, b) => acc + b.byteLength, 0);
    const tarBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const b of blocks) {
      tarBuffer.set(b, offset);
      offset += b.byteLength;
    }

    let compressed = tarBuffer;
    if (zstdSimpleInstance) {
      try {
        compressed = zstdSimpleInstance.compress(tarBuffer);
      } catch (err) {
        console.warn("Zstd compression fallback to raw tar:", err);
      }
    }

    res.setHeader("Content-Type", "application/zstd");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}.tar.zst"`);
    res.send(Buffer.from(compressed));
  } catch (err: any) {
    console.error("Tar.zst compression error:", err);
    res.status(500).json({ error: "Failed to create .tar.zst archive" });
  }
});

// Directly Import Webpage by URL API Endpoint
app.post("/api/import/url", async (req, res) => {
  try {
    let { targetUrl, rawHtmlPayload, fetchExternalStyles = true, fetchExternalScripts = false } = req.body;

    let rawHtml = "";
    let finalUrl = targetUrl || "https://imported-page.local";

    if (rawHtmlPayload && typeof rawHtmlPayload === "string" && rawHtmlPayload.trim().length > 0) {
      rawHtml = rawHtmlPayload;
      if (targetUrl && /^https?:\/\//i.test(targetUrl.trim())) {
        finalUrl = targetUrl.trim();
      }
    } else {
      if (!targetUrl || typeof targetUrl !== "string") {
        return res.status(200).json({ success: false, error: "Target URL string or HTML source payload is required" });
      }

      targetUrl = targetUrl.trim();
      const hasProtocol = /^https?:\/\//i.test(targetUrl);
      if (!hasProtocol) {
        targetUrl = `https://${targetUrl}`;
      }

      // Fetch target webpage with SSL bypass and HTTP/HTTPS fallback support
      let fetchedPage;
      try {
        fetchedPage = await fetchUrlContent(targetUrl);
      } catch (fetchErr: any) {
        // If no explicit protocol was provided and HTTPS failed, automatically attempt HTTP fallback
        if (!hasProtocol && targetUrl.startsWith("https://")) {
          const httpFallbackUrl = targetUrl.replace(/^https:\/\//i, "http://");
          try {
            fetchedPage = await fetchUrlContent(httpFallbackUrl);
          } catch {
            return res.status(200).json({ 
              success: false, 
              error: `Unable to connect to webpage (tried HTTPS and HTTP): ${fetchErr?.message || 'Connection failed or blocked by host'}`
            });
          }
        } else {
          return res.status(200).json({ 
            success: false, 
            error: `Unable to connect to webpage: ${fetchErr?.message || 'Connection failed or blocked by host'}`
          });
        }
      }

      if (fetchedPage.status >= 400) {
        let statusDesc = `HTTP status ${fetchedPage.status} ${fetchedPage.statusText}`;
        if (fetchedPage.status === 403) {
          statusDesc = "HTTP 403 Forbidden. This target website enforces strict Cloudflare/bot access protection. You can use the 'Paste Raw HTML' tab below to import its source code directly.";
        } else if (fetchedPage.status === 404) {
          statusDesc = "HTTP 404 Not Found. The requested URL page could not be located on the server.";
        }
        return res.status(200).json({
          success: false,
          error: `Webpage import restricted: ${statusDesc}`,
        });
      }

      rawHtml = fetchedPage.text;
      finalUrl = fetchedPage.finalUrl || targetUrl;
    }

    let parsedBaseUrl: URL;
    try {
      parsedBaseUrl = new URL(finalUrl);
    } catch {
      parsedBaseUrl = new URL("https://imported-page.local");
    }

    // Helper to resolve relative URLs to absolute
    const resolveUrl = (relative: string) => {
      if (!relative) return "";
      try {
        if (relative.startsWith("//")) return `${parsedBaseUrl.protocol}${relative}`;
        if (relative.startsWith("data:") || relative.startsWith("blob:") || relative.startsWith("javascript:")) return relative;
        return new URL(relative, parsedBaseUrl).href;
      } catch {
        return relative;
      }
    };

    // Extract Page Title
    const titleMatch = rawHtml.match(/<title[^>]*>([^<]*)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : parsedBaseUrl.hostname;

    // Discover and process Stylesheets
    const stylesheetUrls: string[] = [];
    const cssSnippets: string[] = [];

    // Inline <style> tags
    const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleTagRegex.exec(rawHtml)) !== null) {
      if (styleMatch[1] && styleMatch[1].trim()) {
        cssSnippets.push(`/* Inline Style Tag */\n${styleMatch[1].trim()}`);
      }
    }

    // External <link rel="stylesheet">
    const linkTagRegex = /<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi;
    let linkMatch;
    while ((linkMatch = linkTagRegex.exec(rawHtml)) !== null) {
      const hrefMatch = linkMatch[0].match(/href=["']([^"']+)["']/i);
      if (hrefMatch && hrefMatch[1]) {
        const absCssUrl = resolveUrl(hrefMatch[1]);
        stylesheetUrls.push(absCssUrl);
      }
    }

    // Fetch external CSS stylesheets if requested
    if (fetchExternalStyles && stylesheetUrls.length > 0) {
      const fetchPromises = stylesheetUrls.slice(0, 8).map(async (cssUrl) => {
        try {
          const cssRes = await fetchUrlContent(cssUrl);
          if (cssRes.status < 400) {
            let cssText = cssRes.text;
            // Resolve relative url(...) inside CSS
            cssText = cssText.replace(/url\((['"]?)([^'"\)]+)\1\)/gi, (match, quote, path) => {
              if (path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) return match;
              const absPath = resolveUrl(path);
              return `url('${absPath}')`;
            });
            return `/* Stylesheet: ${cssUrl} */\n${cssText}`;
          }
        } catch (err) {
          console.warn(`Failed to fetch external CSS from ${cssUrl}`, err);
        }
        return `/* Failed to fetch external stylesheet: ${cssUrl} */`;
      });

      const fetchedCss = await Promise.all(fetchPromises);
      cssSnippets.push(...fetchedCss.filter(Boolean));
    }

    // Discover & Process Scripts
    const scriptUrls: string[] = [];
    const jsSnippets: string[] = [];
    const scriptTagRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
    let scriptMatch;

    while ((scriptMatch = scriptTagRegex.exec(rawHtml)) !== null) {
      const fullTag = scriptMatch[0];
      const inlineCode = scriptMatch[1];
      const srcMatch = fullTag.match(/src=["']([^"']+)["']/i);

      if (srcMatch && srcMatch[1]) {
        const absJsUrl = resolveUrl(srcMatch[1]);
        scriptUrls.push(absJsUrl);

        if (fetchExternalScripts) {
          try {
            const jsRes = await fetchUrlContent(absJsUrl);
            if (jsRes.status < 400) {
              jsSnippets.push(`// External Script: ${absJsUrl}\n${jsRes.text}`);
            }
          } catch {
            jsSnippets.push(`// Linked script: ${absJsUrl}`);
          }
        } else {
          jsSnippets.push(`// External script resource linked: ${absJsUrl}`);
        }
      } else if (inlineCode && inlineCode.trim()) {
        // Exclude JSON-LD or non-javascript scripts
        const typeMatch = fullTag.match(/type=["']([^"']+)["']/i);
        if (!typeMatch || /javascript|ecmascript|module/i.test(typeMatch[1])) {
          jsSnippets.push(`// Inline Script\n${inlineCode.trim()}`);
        }
      }
    }

    // Extract Linked Media Assets (Images, Videos, Audios, SVGs, Favicons)
    const mediaItems: Array<{ url: string; type: string; alt?: string }> = [];
    const mediaSeen = new Set<string>();

    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(rawHtml)) !== null) {
      const absImgUrl = resolveUrl(imgMatch[1]);
      if (absImgUrl && !mediaSeen.has(absImgUrl)) {
        mediaSeen.add(absImgUrl);
        const altMatch = imgMatch[0].match(/alt=["']([^"']*)["']/i);
        mediaItems.push({
          url: absImgUrl,
          type: 'image',
          alt: altMatch ? altMatch[1] : undefined,
        });
      }
    }

    // Media in <source>, <video>, <audio>
    const sourceRegex = /<(source|video|audio)[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let sourceMatch;
    while ((sourceMatch = sourceRegex.exec(rawHtml)) !== null) {
      const absMediaUrl = resolveUrl(sourceMatch[2]);
      if (absMediaUrl && !mediaSeen.has(absMediaUrl)) {
        mediaSeen.add(absMediaUrl);
        mediaItems.push({
          url: absMediaUrl,
          type: sourceMatch[1].toLowerCase(),
        });
      }
    }

    // Convert relative URLs in HTML attributes (src, href, srcset, poster, action) to absolute
    let processedHtml = rawHtml;

    // Convert src="..." and href="..."
    processedHtml = processedHtml.replace(/(src|href|poster|action)=(["'])([^"']+)\2/gi, (match, attr, quote, path) => {
      // Don't modify standard internal anchors like #about or javascript:
      if (path.startsWith('#') || path.startsWith('javascript:')) return match;
      const abs = resolveUrl(path);
      return `${attr}=${quote}${abs}${quote}`;
    });

    // Convert srcset="..."
    processedHtml = processedHtml.replace(/srcset=(["'])([^"']+)\1/gi, (match, quote, srcsetVal) => {
      const updatedSrcset = srcsetVal.split(',').map((part) => {
        const trimmed = part.trim();
        const spaceIdx = trimmed.search(/\s/);
        if (spaceIdx === -1) return resolveUrl(trimmed);
        const urlPart = trimmed.substring(0, spaceIdx);
        const descriptorPart = trimmed.substring(spaceIdx);
        return `${resolveUrl(urlPart)}${descriptorPart}`;
      }).join(', ');
      return `srcset=${quote}${updatedSrcset}${quote}`;
    });

    // Extract body content if available
    const bodyMatch = processedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyOnlyHtml = bodyMatch ? bodyMatch[1].trim() : processedHtml;

    // Code check & verification summary
    const combinedCss = cssSnippets.join("\n\n");
    const combinedJs = jsSnippets.join("\n\n");

    return res.json({
      success: true,
      url: finalUrl,
      title: pageTitle,
      html: processedHtml,
      bodyHtml: bodyOnlyHtml,
      css: combinedCss,
      js: combinedJs,
      media: mediaItems,
      stylesheets: stylesheetUrls,
      scripts: scriptUrls,
      stats: {
        htmlLength: processedHtml.length,
        bodyHtmlLength: bodyOnlyHtml.length,
        cssLength: combinedCss.length,
        jsLength: combinedJs.length,
        mediaCount: mediaItems.length,
        stylesheetsCount: stylesheetUrls.length,
        scriptsCount: scriptUrls.length,
      },
    });
  } catch (error: any) {
    console.error("URL Import Error:", error);
    return res.status(200).json({ success: false, error: error?.message || "Failed to import webpage from URL" });
  }
});

// Real-Time Collaboration WebSocket Server
interface ClientWS extends WebSocket {
  roomId?: string;
  userId?: string;
  userName?: string;
  userColor?: string;
}

const rooms = new Map<string, Set<ClientWS>>();
const roomState = new Map<string, { files?: any[]; chat?: any[] }>();

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws: ClientWS) => {
  ws.on("message", (rawMessage: string) => {
    try {
      const data = JSON.parse(rawMessage);

      switch (data.type) {
        case "join_room": {
          const { roomId, userId, userName, userColor } = data;
          ws.roomId = roomId;
          ws.userId = userId;
          ws.userName = userName;
          ws.userColor = userColor;

          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
            roomState.set(roomId, { files: data.initialFiles || [], chat: [] });
          }

          const roomClients = rooms.get(roomId)!;
          roomClients.add(ws);

          const activeUsers = Array.from(roomClients).map((c) => ({
            id: c.userId,
            name: c.userName,
            color: c.userColor,
            isOnline: true,
          }));

          const state = roomState.get(roomId);
          ws.send(
            JSON.stringify({
              type: "room_joined",
              roomId,
              users: activeUsers,
              files: state?.files || [],
              chat: state?.chat || [],
            })
          );

          broadcastToRoom(
            roomId,
            {
              type: "user_joined",
              user: { id: userId, name: userName, color: userColor, isOnline: true },
              users: activeUsers,
            },
            ws
          );
          break;
        }

        case "sync_files": {
          if (ws.roomId) {
            const state = roomState.get(ws.roomId) || {};
            state.files = data.files;
            roomState.set(ws.roomId, state);

            broadcastToRoom(
              ws.roomId,
              {
                type: "files_synced",
                files: data.files,
                senderId: ws.userId,
                senderName: ws.userName,
              },
              ws
            );
          }
          break;
        }

        case "cursor_move": {
          if (ws.roomId) {
            broadcastToRoom(
              ws.roomId,
              {
                type: "cursor_moved",
                userId: ws.userId,
                userName: ws.userName,
                userColor: ws.userColor,
                cursor: data.cursor,
              },
              ws
            );
          }
          break;
        }

        case "chat_message": {
          if (ws.roomId) {
            const state = roomState.get(ws.roomId) || {};
            const chatMsg = {
              id: "msg-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
              senderId: ws.userId,
              senderName: ws.userName,
              senderColor: ws.userColor,
              text: data.text,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            state.chat = [...(state.chat || []), chatMsg];
            roomState.set(ws.roomId, state);

            broadcastToRoom(ws.roomId, {
              type: "new_chat_message",
              message: chatMsg,
            });
          }
          break;
        }
      }
    } catch (e) {
      console.error("WS Message Error:", e);
    }
  });

  ws.on("close", () => {
    if (ws.roomId && rooms.has(ws.roomId)) {
      const roomClients = rooms.get(ws.roomId)!;
      roomClients.delete(ws);

      const activeUsers = Array.from(roomClients).map((c) => ({
        id: c.userId,
        name: c.userName,
        color: c.userColor,
        isOnline: true,
      }));

      broadcastToRoom(ws.roomId, {
        type: "user_left",
        userId: ws.userId,
        userName: ws.userName,
        users: activeUsers,
      });

      if (roomClients.size === 0) {
        rooms.delete(ws.roomId);
      }
    }
  });
});

function broadcastToRoom(roomId: string, messageObj: any, excludeWs?: ClientWS) {
  const roomClients = rooms.get(roomId);
  if (!roomClients) return;
  const jsonStr = JSON.stringify(messageObj);

  for (const client of roomClients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(jsonStr);
    }
  }
}

// VITE MIDDLEWARE SETUP
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 ApexStudio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
