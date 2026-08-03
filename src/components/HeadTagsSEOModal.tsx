import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Globe, 
  Share2, 
  Smartphone, 
  Check, 
  Copy, 
  X, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Code2,
  Tag,
  Eye,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { ThemeMode } from '../types';

interface HeadTagsSEOModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  onUpdateHtml: (newHtmlContent: string) => void;
  activeFileName?: string;
  themeMode?: ThemeMode;
}

export interface SEOHeadData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  robots: string; // e.g. "index, follow" or "noindex, nofollow"
  viewport: string;
  themeColor: string;
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  // Twitter
  twitterCard: string; // "summary" | "summary_large_image"
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  // Extra custom tags
  customMetaTags: { name: string; content: string }[];
}

const DEFAULT_SEO_DATA: SEOHeadData = {
  title: '',
  description: '',
  keywords: '',
  author: '',
  canonicalUrl: '',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#4f46e5',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogUrl: '',
  ogType: 'website',
  ogSiteName: '',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterSite: '',
  customMetaTags: []
};

/**
 * Parses head tags from HTML string content
 */
function parseHeadTagsFromHTML(html: string): SEOHeadData {
  const data: SEOHeadData = { ...DEFAULT_SEO_DATA };
  if (!html) return data;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Title
    const titleEl = doc.querySelector('head title');
    if (titleEl && titleEl.textContent) {
      data.title = titleEl.textContent.trim();
    }

    // Meta tags
    const metas = doc.querySelectorAll('head meta');
    metas.forEach((meta) => {
      const name = meta.getAttribute('name')?.toLowerCase();
      const property = meta.getAttribute('property')?.toLowerCase();
      const content = meta.getAttribute('content') || '';

      if (name === 'description') data.description = content;
      else if (name === 'keywords') data.keywords = content;
      else if (name === 'author') data.author = content;
      else if (name === 'viewport') data.viewport = content;
      else if (name === 'robots') data.robots = content;
      else if (name === 'theme-color') data.themeColor = content;
      else if (name === 'twitter:card') data.twitterCard = content;
      else if (name === 'twitter:title') data.twitterTitle = content;
      else if (name === 'twitter:description') data.twitterDescription = content;
      else if (name === 'twitter:image') data.twitterImage = content;
      else if (name === 'twitter:site') data.twitterSite = content;

      if (property === 'og:title') data.ogTitle = content;
      else if (property === 'og:description') data.ogDescription = content;
      else if (property === 'og:image') data.ogImage = content;
      else if (property === 'og:url') data.ogUrl = content;
      else if (property === 'og:type') data.ogType = content;
      else if (property === 'og:site_name') data.ogSiteName = content;
    });

    // Canonical Link
    const canonicalLink = doc.querySelector('head link[rel="canonical"]');
    if (canonicalLink) {
      data.canonicalUrl = canonicalLink.getAttribute('href') || '';
    }
  } catch (err) {
    console.warn('DOMParser failed to parse head tags:', err);
  }

  return data;
}

/**
 * Generates clean HTML string with updated head tags
 */
function injectHeadTagsIntoHTML(html: string, seo: SEOHeadData): string {
  const parser = new DOMParser();
  let doc: Document;
  try {
    doc = parser.parseFromString(html, 'text/html');
  } catch {
    return html;
  }

  let head = doc.querySelector('head');
  if (!head) {
    head = doc.createElement('head');
    if (doc.documentElement) {
      doc.documentElement.insertBefore(head, doc.documentElement.firstChild);
    }
  }

  // 1. Update Title
  let titleEl = head.querySelector('title');
  if (seo.title) {
    if (!titleEl) {
      titleEl = doc.createElement('title');
      head.appendChild(titleEl);
    }
    titleEl.textContent = seo.title;
  } else if (titleEl) {
    titleEl.remove();
  }

  // Helper function to set or remove meta tag
  const setMetaByName = (name: string, content: string) => {
    let el = head!.querySelector(`meta[name="${name}"]`);
    if (content.trim()) {
      if (!el) {
        el = doc.createElement('meta');
        el.setAttribute('name', name);
        head!.appendChild(el);
      }
      el.setAttribute('content', content.trim());
    } else if (el) {
      el.remove();
    }
  };

  const setMetaByProperty = (property: string, content: string) => {
    let el = head!.querySelector(`meta[property="${property}"]`);
    if (content.trim()) {
      if (!el) {
        el = doc.createElement('meta');
        el.setAttribute('property', property);
        head!.appendChild(el);
      }
      el.setAttribute('content', content.trim());
    } else if (el) {
      el.remove();
    }
  };

  // Basic SEO Metas
  setMetaByName('description', seo.description);
  setMetaByName('keywords', seo.keywords);
  setMetaByName('author', seo.author);
  setMetaByName('viewport', seo.viewport || 'width=device-width, initial-scale=1.0');
  setMetaByName('robots', seo.robots || 'index, follow');
  setMetaByName('theme-color', seo.themeColor);

  // Open Graph Metas
  setMetaByProperty('og:title', seo.ogTitle || seo.title);
  setMetaByProperty('og:description', seo.ogDescription || seo.description);
  setMetaByProperty('og:image', seo.ogImage);
  setMetaByProperty('og:url', seo.ogUrl || seo.canonicalUrl);
  setMetaByProperty('og:type', seo.ogType || 'website');
  setMetaByProperty('og:site_name', seo.ogSiteName);

  // Twitter Metas
  setMetaByName('twitter:card', seo.twitterCard || 'summary_large_image');
  setMetaByName('twitter:title', seo.twitterTitle || seo.ogTitle || seo.title);
  setMetaByName('twitter:description', seo.twitterDescription || seo.ogDescription || seo.description);
  setMetaByName('twitter:image', seo.twitterImage || seo.ogImage);
  setMetaByName('twitter:site', seo.twitterSite);

  // Canonical Link
  let canonicalEl = head.querySelector('link[rel="canonical"]');
  if (seo.canonicalUrl.trim()) {
    if (!canonicalEl) {
      canonicalEl = doc.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seo.canonicalUrl.trim());
  } else if (canonicalEl) {
    canonicalEl.remove();
  }

  // Serialize back to HTML string
  return doc.documentElement.outerHTML;
}

export const HeadTagsSEOModal: React.FC<HeadTagsSEOModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
  onUpdateHtml,
  activeFileName = 'index.html',
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'mobile' | 'preview'>('basic');
  const [seo, setSeo] = useState<SEOHeadData>(DEFAULT_SEO_DATA);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  // Populate form from existing HTML content on open
  useEffect(() => {
    if (isOpen) {
      const parsed = parseHeadTagsFromHTML(htmlContent);
      setSeo(parsed);
    }
  }, [isOpen, htmlContent]);

  // SEO Audit calculation
  const seoAudit = useMemo(() => {
    const issues: { type: 'error' | 'warning' | 'pass'; text: string }[] = [];
    let score = 100;

    // Title checks
    if (!seo.title.trim()) {
      issues.push({ type: 'error', text: 'Missing <title> tag. Search engines require a clear page title.' });
      score -= 30;
    } else if (seo.title.length < 20) {
      issues.push({ type: 'warning', text: 'Page title is short (< 20 chars). Recommended 50-60 characters.' });
      score -= 10;
    } else if (seo.title.length > 60) {
      issues.push({ type: 'warning', text: `Page title is long (${seo.title.length} chars). It will get truncated on Google.` });
      score -= 5;
    } else {
      issues.push({ type: 'pass', text: `Optimal page title length (${seo.title.length} characters).` });
    }

    // Description checks
    if (!seo.description.trim()) {
      issues.push({ type: 'error', text: 'Missing meta description tag. Google snippets will use raw page text.' });
      score -= 25;
    } else if (seo.description.length < 70) {
      issues.push({ type: 'warning', text: 'Meta description is brief (< 70 chars). Recommended 120-160 characters.' });
      score -= 10;
    } else if (seo.description.length > 160) {
      issues.push({ type: 'warning', text: `Meta description is long (${seo.description.length} chars). Snippet will cut off.` });
      score -= 5;
    } else {
      issues.push({ type: 'pass', text: `Optimal meta description length (${seo.description.length} characters).` });
    }

    // Viewport check
    if (!seo.viewport.includes('width=device-width')) {
      issues.push({ type: 'error', text: 'Viewport tag missing "width=device-width". Mobile layout may break.' });
      score -= 15;
    } else {
      issues.push({ type: 'pass', text: 'Mobile-friendly viewport tag detected.' });
    }

    // Open Graph check
    if (!seo.ogTitle && !seo.title) {
      issues.push({ type: 'warning', text: 'Missing Open Graph title for social media sharing.' });
      score -= 10;
    } else if (!seo.ogImage) {
      issues.push({ type: 'warning', text: 'No og:image specified. Social shares will lack thumbnail preview card.' });
      score -= 10;
    } else {
      issues.push({ type: 'pass', text: 'Open Graph title & image specified for rich social previews.' });
    }

    // Canonical link
    if (!seo.canonicalUrl) {
      issues.push({ type: 'warning', text: 'No canonical URL link set. Helps prevent duplicate content penalties.' });
      score -= 5;
    } else {
      issues.push({ type: 'pass', text: 'Canonical URL is set.' });
    }

    return {
      score: Math.max(0, score),
      issues
    };
  }, [seo]);

  const handleSave = () => {
    const updatedHtml = injectHeadTagsIntoHTML(htmlContent, seo);
    onUpdateHtml(updatedHtml);
    setSaveSuccessToast(true);
    setTimeout(() => {
      setSaveSuccessToast(false);
      onClose();
    }, 1200);
  };

  const handleAutoFillSocial = () => {
    setSeo((prev) => ({
      ...prev,
      ogTitle: prev.ogTitle || prev.title,
      ogDescription: prev.ogDescription || prev.description,
      twitterTitle: prev.twitterTitle || prev.ogTitle || prev.title,
      twitterDescription: prev.twitterDescription || prev.ogDescription || prev.description,
    }));
  };

  const handleQuickPreset = (preset: 'standard' | 'noindex' | 'mobile') => {
    if (preset === 'standard') {
      setSeo((prev) => ({
        ...prev,
        robots: 'index, follow',
        viewport: 'width=device-width, initial-scale=1.0',
        ogType: 'website'
      }));
    } else if (preset === 'noindex') {
      setSeo((prev) => ({
        ...prev,
        robots: 'noindex, nofollow'
      }));
    } else if (preset === 'mobile') {
      setSeo((prev) => ({
        ...prev,
        viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
        themeColor: '#4f46e5'
      }));
    }
  };

  const generatedTagsCode = useMemo(() => {
    const tempHtml = injectHeadTagsIntoHTML('<!DOCTYPE html><html><head></head><body></body></html>', seo);
    const parser = new DOMParser();
    const doc = parser.parseFromString(tempHtml, 'text/html');
    return doc.head ? doc.head.innerHTML.trim() : '';
  }, [seo]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedTagsCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 select-none ${
      isDark ? 'bg-slate-950/80' : 'bg-slate-900/40'
    }`}>
      <div className={`border rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl transition-all overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white shadow-md">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">SEO & Head Tags Manager</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-semibold">
                  {activeFileName}
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Edit meta titles, description, Open Graph tags, viewport settings, and live social previews
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Score pill */}
            <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 font-mono text-xs ${
              seoAudit.score >= 80 
                ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
                : seoAudit.score >= 50
                ? 'bg-amber-950/50 border-amber-800 text-amber-300'
                : 'bg-red-950/50 border-red-800 text-red-300'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEO Health: <strong>{seoAudit.score}%</strong></span>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className={`border-b px-6 flex items-center space-x-1 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/60 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium text-xs border-b-2 transition-all ${
              activeTab === 'basic'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>1. Basic SEO Tags</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium text-xs border-b-2 transition-all ${
              activeTab === 'social'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>2. Open Graph & Social</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium text-xs border-b-2 transition-all ${
              activeTab === 'mobile'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>3. Viewport & Mobile</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-2 px-4 py-3 font-medium text-xs border-b-2 transition-all ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>4. Live Preview & Audit</span>
          </button>
        </div>

        {/* Modal Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC SEO */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold flex items-center space-x-1.5">
                      <span>Page Title (&lt;title&gt;)</span>
                      <span className="text-indigo-400 font-normal text-[11px]">*Required</span>
                    </label>
                    <span className={`text-[11px] font-mono ${
                      seo.title.length > 60 ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {seo.title.length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seo.title}
                    onChange={(e) => setSeo({ ...seo, title: e.target.value })}
                    placeholder="e.g. Modern Web Development Studio | ApexStudio"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold">Meta Description (&lt;meta name="description"&gt;)</label>
                    <span className={`text-[11px] font-mono ${
                      seo.description.length > 160 ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {seo.description.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seo.description}
                    onChange={(e) => setSeo({ ...seo, description: e.target.value })}
                    placeholder="Provide a concise, attractive summary of your webpage for Google search snippets..."
                    className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Keywords (&lt;meta name="keywords"&gt;)</label>
                  <input
                    type="text"
                    value={seo.keywords}
                    onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                    placeholder="e.g. web studio, react, html5, seo, design"
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Author (&lt;meta name="author"&gt;)</label>
                  <input
                    type="text"
                    value={seo.author}
                    onChange={(e) => setSeo({ ...seo, author: e.target.value })}
                    placeholder="e.g. ApexStudio Team"
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Canonical URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Canonical URL (&lt;link rel="canonical"&gt;)</label>
                  <input
                    type="url"
                    value={seo.canonicalUrl}
                    onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                    placeholder="e.g. https://mywebsite.com/page"
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Robots Indexing Directive */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Robots Search Directive (&lt;meta name="robots"&gt;)</label>
                  <select
                    value={seo.robots}
                    onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="index, follow">index, follow (Allow search indexing & link crawling)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Prevent search indexing)</option>
                    <option value="index, nofollow">index, nofollow (Index page, ignore links)</option>
                    <option value="noindex, follow">noindex, follow (Do not index, crawl links)</option>
                  </select>
                </div>
              </div>

              {/* Quick Presets row */}
              <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${
                isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Quick Presets:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('standard')}
                    className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-700/50 rounded-lg text-xs font-medium transition-colors"
                  >
                    Standard Indexing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('noindex')}
                    className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700/50 rounded-lg text-xs font-medium transition-colors"
                  >
                    Block Indexing (noindex)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPEN GRAPH & SOCIAL */}
          {activeTab === 'social' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-indigo-950/40 border border-indigo-900/50 p-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-indigo-300">Open Graph & Social Media Cards</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Controls how your link looks when shared on Facebook, LinkedIn, Twitter, Discord & WhatsApp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFillSocial}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-fill from Basic SEO</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* OG Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">OG Title (og:title)</label>
                  <input
                    type="text"
                    value={seo.ogTitle}
                    onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                    placeholder={seo.title || 'e.g. Modern Web Studio'}
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* OG Site Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">OG Site Name (og:site_name)</label>
                  <input
                    type="text"
                    value={seo.ogSiteName}
                    onChange={(e) => setSeo({ ...seo, ogSiteName: e.target.value })}
                    placeholder="e.g. ApexStudio Website"
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* OG Description */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold">OG Description (og:description)</label>
                  <textarea
                    rows={2}
                    value={seo.ogDescription}
                    onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                    placeholder={seo.description || 'Social preview description...'}
                    className={`w-full p-3 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* OG Image */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold">Social Banner Image URL (og:image & twitter:image)</label>
                  <input
                    type="url"
                    value={seo.ogImage}
                    onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                    placeholder="e.g. https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630"
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Twitter Card Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Twitter Card Format (twitter:card)</label>
                  <select
                    value={seo.twitterCard}
                    onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value })}
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="summary_large_image">summary_large_image (Large Banner Card)</option>
                    <option value="summary">summary (Small Square Thumbnail Card)</option>
                  </select>
                </div>

                {/* Twitter Handle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Twitter Account Handle (twitter:site)</label>
                  <input
                    type="text"
                    value={seo.twitterSite}
                    onChange={(e) => setSeo({ ...seo, twitterSite: e.target.value })}
                    placeholder="e.g. @apexstudio_app"
                    className={`w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIEWPORT & MOBILE */}
          {activeTab === 'mobile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Viewport Meta */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold">Viewport Content String (&lt;meta name="viewport"&gt;)</label>
                  <input
                    type="text"
                    value={seo.viewport}
                    onChange={(e) => setSeo({ ...seo, viewport: e.target.value })}
                    placeholder="width=device-width, initial-scale=1.0"
                    className={`w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                {/* Theme Color */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Browser Theme Color (&lt;meta name="theme-color"&gt;)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={seo.themeColor}
                      onChange={(e) => setSeo({ ...seo, themeColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={seo.themeColor}
                      onChange={(e) => setSeo({ ...seo, themeColor: e.target.value })}
                      placeholder="#4f46e5"
                      className={`flex-1 px-3.5 py-2 border rounded-xl font-mono text-xs focus:outline-none focus:border-indigo-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick preset mobile button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('mobile')}
                    className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-medium transition-colors"
                  >
                    Apply Mobile Responsive Defaults
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PREVIEW & AUDIT */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Google Search Result Mockup */}
              <div className="space-y-2">
                <div className="text-xs font-bold flex items-center space-x-2 text-slate-300">
                  <Search className="w-4 h-4 text-indigo-400" />
                  <span>Google Search Result Snippet Preview</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-sm space-y-1 font-sans select-text">
                  <div className="text-[12px] text-slate-600 flex items-center space-x-1 truncate">
                    <span>{seo.canonicalUrl || 'https://example.com'}</span>
                    <span className="text-slate-400">›</span>
                  </div>
                  <div className="text-base text-blue-800 font-medium hover:underline cursor-pointer truncate">
                    {seo.title || 'Untitled Page - Add a Title'}
                  </div>
                  <div className="text-xs text-slate-600 leading-normal line-clamp-2">
                    {seo.description || 'No meta description configured. Search engines will display an excerpt from your page content here.'}
                  </div>
                </div>
              </div>

              {/* Social Media Share Card Mockup */}
              <div className="space-y-2">
                <div className="text-xs font-bold flex items-center space-x-2 text-slate-300">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Social Media Card Preview (Facebook / Twitter)</span>
                </div>
                <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden shadow-lg select-text max-w-lg">
                  <div className="h-44 bg-slate-900 overflow-hidden flex items-center justify-center relative">
                    {seo.ogImage ? (
                      <img 
                        src={seo.ogImage} 
                        alt="OG Banner" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-600 space-y-1">
                        <Share2 className="w-8 h-8 mx-auto text-slate-700" />
                        <span className="text-xs block">No Social Banner Image (og:image)</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                      {seo.ogSiteName || seo.canonicalUrl || 'MYWEBSITE.COM'}
                    </span>
                    <h5 className="text-xs font-bold text-slate-100 line-clamp-1">
                      {seo.ogTitle || seo.title || 'Page Title'}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {seo.ogDescription || seo.description || 'Social description...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Generated Head Code Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold flex items-center space-x-2 text-slate-300">
                    <Code2 className="w-4 h-4 text-sky-400" />
                    <span>Generated &lt;head&gt; HTML Output</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy HTML'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-sky-300 overflow-x-auto whitespace-pre max-h-48">
                  {generatedTagsCode || '<!-- No head tags generated -->'}
                </pre>
              </div>

              {/* Audit Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300">SEO Recommendations Audit</div>
                <div className="space-y-2">
                  {seoAudit.issues.map((issue, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs ${
                        issue.type === 'pass'
                          ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'
                          : issue.type === 'warning'
                          ? 'bg-amber-950/30 border-amber-900/50 text-amber-300'
                          : 'bg-red-950/30 border-red-900/50 text-red-300'
                      }`}
                    >
                      {issue.type === 'pass' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />}
                      {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />}
                      {issue.type === 'error' && <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />}
                      <span>{issue.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Updates active HTML file &lt;head&gt; tags automatically.</span>
          </div>

          <div className="flex items-center space-x-3">
            {saveSuccessToast && (
              <span className="text-xs text-emerald-400 flex items-center space-x-1 font-semibold animate-bounce">
                <Check className="w-4 h-4" />
                <span>Head Tags Applied to HTML!</span>
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/25 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Apply Head Tags to HTML</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
