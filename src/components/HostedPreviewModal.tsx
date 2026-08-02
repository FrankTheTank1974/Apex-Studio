import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Globe, 
  ExternalLink, 
  RotateCw, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  Maximize2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ThemeMode } from '../types';

interface HostedPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  themeMode?: ThemeMode;
}

export const HostedPreviewModal: React.FC<HostedPreviewModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
  cssContent,
  jsContent,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile' | 'full'>('full');
  const [hostedTheme, setHostedTheme] = useState<'light' | 'dark'>(isDark ? 'dark' : 'light');
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string>('');

  // Generate full standalone HTML payload without editor outlines or helper scripts
  const generateFullHostedHtml = () => {
    return `<!DOCTYPE html>
<html class="${hostedTheme === 'dark' ? 'dark' : ''}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hosted Webpage Preview</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class'
      };
    </script>
    <!-- Google Fonts Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- User CSS Custom Styles -->
    <style>
      ${cssContent}
    </style>
  </head>
  <body class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
    ${htmlContent}
    <!-- User JavaScript Scripts -->
    <script>
      try {
        ${jsContent}
      } catch (err) {
        console.error('Hosted JS Execution Error:', err);
      }
    </script>
  </body>
</html>`;
  };

  useEffect(() => {
    if (!isOpen) return;
    const fullHtml = generateFullHostedHtml();
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [isOpen, htmlContent, cssContent, jsContent, hostedTheme, refreshKey]);

  // Open hosted preview in a new browser tab/window
  const handleOpenInNewTab = () => {
    const fullHtml = generateFullHostedHtml();
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newTab = window.open(url, '_blank');
    if (!newTab) {
      // Fallback if popup blocked
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.click();
    }
  };

  // Copy clean hosted HTML code to clipboard
  const handleCopyCode = () => {
    const fullHtml = generateFullHostedHtml();
    navigator.clipboard.writeText(fullHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // Viewport width styling logic
  const getViewportContainerStyle = () => {
    switch (deviceViewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] rounded-2xl border-8 border-slate-800 shadow-2xl my-auto';
      case 'tablet':
        return 'w-[768px] h-[92%] rounded-xl border-4 border-slate-800 shadow-2xl my-auto';
      case 'desktop':
        return 'w-[1280px] max-w-full h-[96%] rounded-lg border border-slate-700 shadow-xl my-auto';
      case 'full':
      default:
        return 'w-full h-full rounded-none';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Navigation & Control Bar */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between shrink-0 shadow-lg ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Left Status & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Globe className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold tracking-tight">Hosted Webpage Preview</h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Production Environment</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Clean standalone preview with live JavaScript, CSS styles, & responsive viewports
            </p>
          </div>
        </div>

        {/* Center Viewport & Theme Controls */}
        <div className="flex items-center space-x-2">
          {/* Viewport Switcher */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-0.5">
            <button
              onClick={() => setDeviceViewport('full')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
                deviceViewport === 'full'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Full Screen Width"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">100% Full</span>
            </button>
            <button
              onClick={() => setDeviceViewport('desktop')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
                deviceViewport === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Desktop (1280px)"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceViewport('tablet')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
                deviceViewport === 'tablet'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceViewport('mobile')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition-all ${
                deviceViewport === 'mobile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Hosted Page Theme Toggle */}
          <button
            onClick={() => setHostedTheme(hostedTheme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs"
            title="Toggle Hosted Webpage Theme (Light / Dark)"
          >
            {hostedTheme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* Refresh Page Button */}
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reload Hosted Page Execution"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Copy Clean HTML Code */}
          <button
            onClick={handleCopyCode}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Copy standalone production HTML code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
          </button>

          {/* Open in New Browser Tab */}
          <button
            onClick={handleOpenInNewTab}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
            title="Open hosted webpage in a new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in New Tab</span>
          </button>

          {/* Close Hosted Preview Modal */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title="Exit Hosted Preview (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hosted Canvas Frame Stage */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 relative">
        <div className={`transition-all duration-300 ease-out overflow-hidden bg-white ${getViewportContainerStyle()}`}>
          {blobUrl ? (
            <iframe
              key={refreshKey}
              src={blobUrl}
              title="Hosted Webpage Live Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs">
              Loading hosted preview stream...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
