import React, { useState } from 'react';
import { 
  X, 
  Link as LinkIcon, 
  Globe, 
  Download, 
  Check, 
  AlertCircle, 
  Code, 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { ThemeMode } from '../types';

interface MediaItem {
  url: string;
  type: string;
  alt?: string;
}

interface ImportStats {
  htmlLength: number;
  bodyHtmlLength: number;
  cssLength: number;
  jsLength: number;
  mediaCount: number;
  stylesheetsCount: number;
  scriptsCount: number;
}

interface ImportResultData {
  url: string;
  title: string;
  html: string;
  bodyHtml: string;
  css: string;
  js: string;
  media: MediaItem[];
  stylesheets: string[];
  scripts: string[];
  stats: ImportStats;
}

interface ImportUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportWebpage: (htmlContent: string, cssContent: string, jsContent: string) => void;
  themeMode?: ThemeMode;
}

export const ImportUrlModal: React.FC<ImportUrlModalProps> = ({
  isOpen,
  onClose,
  onImportWebpage,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [importMode, setImportMode] = useState<'url' | 'rawHtml'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [rawHtmlInput, setRawHtmlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'html' | 'css' | 'js' | 'media'>('overview');
  const [importResult, setImportResult] = useState<ImportResultData | null>(null);

  // Options
  const [useBodyOnly, setUseBodyOnly] = useState(true);
  const [fetchExternalStyles, setFetchExternalStyles] = useState(true);
  const [fetchExternalScripts, setFetchExternalScripts] = useState(false);

  // Preset sample URLs for quick testing
  const SAMPLE_URLS = [
    { label: 'Example.com (HTTP)', url: 'http://example.com' },
    { label: 'Example.com (HTTPS)', url: 'https://example.com' },
    { label: 'NeverSSL (HTTP)', url: 'http://neverssl.com' },
    { label: 'Hacker News (HTTPS)', url: 'https://news.ycombinator.com' },
  ];

  if (!isOpen) return null;

  const handleFetchAndAnalyze = async (targetUrlOverride?: string) => {
    setError(null);
    setImportResult(null);

    if (importMode === 'rawHtml') {
      if (!rawHtmlInput.trim()) {
        setError('Please paste raw HTML source code into the text field below');
        return;
      }
    } else {
      const targetUrl = targetUrlOverride || urlInput;
      if (!targetUrl.trim()) {
        setError('Please enter a valid HTTP or HTTPS webpage URL');
        return;
      }
    }

    setLoading(true);

    try {
      const payload: any = {
        fetchExternalStyles,
        fetchExternalScripts,
      };

      if (importMode === 'rawHtml') {
        payload.rawHtmlPayload = rawHtmlInput;
        payload.targetUrl = urlInput || 'https://imported-page.local';
      } else {
        payload.targetUrl = targetUrlOverride || urlInput;
      }

      const res = await fetch('/api/import/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any;

      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        throw new Error(`Server returned non-JSON response (${res.status}). ${textResponse.slice(0, 120)}`);
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to analyze target webpage');
      }

      setImportResult(data);
      setActiveTab('overview');
    } catch (err: any) {
      console.error('Import Webpage Error:', err);
      setError(err?.message || 'Failed to fetch webpage content. Please check the URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (!importResult) return;
    const finalHtml = useBodyOnly ? importResult.bodyHtml : importResult.html;
    onImportWebpage(finalHtml, importResult.css, importResult.js);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-emerald-500/10' 
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-start justify-between ${
          isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight">Import Webpage by URL</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Web Crawler & Parser
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Fetch HTML, CSS, JavaScript, and linked media assets directly into your workspace
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-all ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input Form & Presets Bar */}
        <div className={`p-4 border-b space-y-3 ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'}`}>
          {/* Mode Switcher Pills */}
          <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-2">
            <button
              onClick={() => { setImportMode('url'); setError(null); }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                importMode === 'url'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Fetch Webpage URL</span>
            </button>

            <button
              onClick={() => { setImportMode('rawHtml'); setError(null); }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                importMode === 'rawHtml'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Paste Raw HTML Source</span>
            </button>
          </div>

          {importMode === 'url' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFetchAndAnalyze()}
                    placeholder="Enter any HTTP or HTTPS website URL (e.g. http://example.com or https://site.com)..."
                    className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border outline-none transition-all ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500'
                        : 'bg-white border-slate-300 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  {urlInput && (
                    <button
                      onClick={() => setUrlInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleFetchAndAnalyze()}
                  disabled={loading}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer ${
                    loading
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center space-x-2 text-xs">
                <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sample presets:</span>
                {SAMPLE_URLS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUrlInput(sample.url);
                      handleFetchAndAnalyze(sample.url);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Target website URL for resolving relative links (optional, e.g. https://site.com)"
                  className={`flex-1 px-3 py-1.5 rounded-xl text-xs border outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  onClick={() => handleFetchAndAnalyze()}
                  disabled={loading || !rawHtmlInput.trim()}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all cursor-pointer ${
                    loading || !rawHtmlInput.trim()
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse HTML Code</span>
                </button>
              </div>

              <textarea
                value={rawHtmlInput}
                onChange={(e) => setRawHtmlInput(e.target.value)}
                placeholder="Paste HTML source code here (e.g. <html><body>...</body></html>)..."
                rows={4}
                className={`w-full p-3 rounded-xl font-mono text-xs border outline-none transition-all resize-y ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-emerald-300 placeholder-slate-500'
                    : 'bg-white border-slate-300 focus:border-emerald-500 text-emerald-800 placeholder-slate-400'
                }`}
              />
            </div>
          )}

          {/* Configuration Options */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={useBodyOnly}
                onChange={(e) => setUseBodyOnly(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Extract body HTML only</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fetchExternalStyles}
                onChange={(e) => setFetchExternalStyles(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Bundle external CSS files</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fetchExternalScripts}
                onChange={(e) => setFetchExternalScripts(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Extract linked JavaScript scripts</span>
            </label>
          </div>
        </div>

        {/* Error Notification with Direct Paste Fallback Trigger */}
        {error && (
          <div className="p-4 bg-rose-500/10 border-b border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            {importMode === 'url' && (
              <button
                onClick={() => {
                  setImportMode('rawHtml');
                  setError(null);
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[11px] shadow-sm shrink-0 ml-2 cursor-pointer transition-all"
              >
                Paste HTML Code Instead
              </button>
            )}
          </div>
        )}

        {/* Main Body: Inspection & Preview Area */}
        <div className="flex-1 overflow-hidden flex flex-col p-5">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 animate-pulse">
                <Globe className="w-6 h-6 animate-spin-slow" />
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Fetching and Analyzing Webpage...
              </h3>
              <p className={`text-xs max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Crawling DOM node structure, extracting CSS stylesheets, collecting JavaScript scripts, and resolving relative media paths.
              </p>
            </div>
          ) : !importResult ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-3">
              <Globe className={`w-12 h-12 opacity-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enter a webpage URL above and click <strong>Analyze URL</strong>
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                All relative image links, stylesheet references, and scripts will automatically be resolved to absolute URLs.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 space-y-3">
              {/* Inspection Tabs */}
              <div className="flex items-center justify-between border-b pb-2 border-slate-800">
                <div className="flex items-center space-x-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: Layers },
                    { id: 'html', label: `HTML (${importResult.stats.htmlLength} bytes)`, icon: Code },
                    { id: 'css', label: `CSS (${importResult.stats.stylesheetsCount} files)`, icon: FileCode },
                    { id: 'js', label: `Scripts (${importResult.stats.scriptsCount})`, icon: FileText },
                    { id: 'media', label: `Media (${importResult.stats.mediaCount})`, icon: ImageIcon },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                            : isDark
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <a
                  href={importResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:underline"
                >
                  <span className="truncate max-w-[200px]">{importResult.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Tab Content Display */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* Header Summary Box */}
                    <div className={`p-4 rounded-xl border flex items-start justify-between ${
                      isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Target Webpage</span>
                        <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {importResult.title || 'Webpage Document'}
                        </h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Successfully analyzed and converted relative paths for all linked media and assets.
                        </p>
                      </div>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <Code className="w-3.5 h-3.5 text-emerald-400" />
                          <span>HTML Document</span>
                        </div>
                        <p className="text-lg font-bold mt-1 text-emerald-400 font-mono">
                          {Math.round(importResult.stats.htmlLength / 1024)} KB
                        </p>
                        <span className="text-[10px] text-slate-500">DOM structure parsed</span>
                      </div>

                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Stylesheets</span>
                        </div>
                        <p className="text-lg font-bold mt-1 text-indigo-400 font-mono">
                          {importResult.stats.stylesheetsCount} Linked
                        </p>
                        <span className="text-[10px] text-slate-500">Extracted styles</span>
                      </div>

                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Scripts</span>
                        </div>
                        <p className="text-lg font-bold mt-1 text-amber-400 font-mono">
                          {importResult.stats.scriptsCount} Scripts
                        </p>
                        <span className="text-[10px] text-slate-500">JavaScript files</span>
                      </div>

                      <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Media Assets</span>
                        </div>
                        <p className="text-lg font-bold mt-1 text-cyan-400 font-mono">
                          {importResult.stats.mediaCount} Assets
                        </p>
                        <span className="text-[10px] text-slate-500">Images & video links</span>
                      </div>
                    </div>

                    {/* Check Verification List */}
                    <div className={`p-4 rounded-xl border space-y-2 ${
                      isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Webpage Quality & Security Checks</span>
                      </h4>
                      <ul className="text-xs space-y-1.5 text-slate-300">
                        <li className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Relative resource URLs converted to absolute paths for reliable rendering</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Inline styles and stylesheet links parsed into clean CSS</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>HTML structure validated for WYSIWYG canvas editing</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'html' && (
                  <pre className="p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800">
                    {useBodyOnly ? importResult.bodyHtml : importResult.html}
                  </pre>
                )}

                {activeTab === 'css' && (
                  <pre className="p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800">
                    {importResult.css || '/* No custom CSS extracted from webpage */'}
                  </pre>
                )}

                {activeTab === 'js' && (
                  <pre className="p-4 rounded-xl bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto border border-slate-800">
                    {importResult.js || '// No custom inline JavaScript extracted'}
                  </pre>
                )}

                {activeTab === 'media' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {importResult.media.length === 0 ? (
                      <div className="col-span-full text-center py-8 text-slate-500 text-xs">
                        No external media assets found on page
                      </div>
                    ) : (
                      importResult.media.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex flex-col justify-between overflow-hidden ${
                            isDark ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="w-full h-24 rounded-lg bg-slate-950 flex items-center justify-center overflow-hidden mb-2 relative">
                            {item.type === 'image' ? (
                              <img
                                src={item.url}
                                alt={item.alt || 'Imported media'}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="text-xs text-slate-400 flex flex-col items-center">
                                <ImageIcon className="w-6 h-6 mb-1 text-cyan-400" />
                                <span className="uppercase text-[10px]">{item.type}</span>
                              </div>
                            )}
                          </div>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-400 hover:underline truncate font-mono"
                            title={item.url}
                          >
                            {item.url}
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={!importResult || loading}
            className={`px-5 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center space-x-2 transition-all cursor-pointer ${
              !importResult || loading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Import into Project Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
