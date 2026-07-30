import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { ZstdCodec } from "zstd-codec";

dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));

const server = http.createServer(app);
const PORT = 3000;

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
      model: "gemini-2.5-flash",
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
