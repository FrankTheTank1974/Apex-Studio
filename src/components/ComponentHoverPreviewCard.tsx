import React, { useState, useMemo } from 'react';
import { ComponentTemplate, ComponentVariant } from '../types';
import { Sparkles, Plus, Copy, Check, Eye, Layers, Sun, Moon } from 'lucide-react';

interface ComponentHoverPreviewCardProps {
  component: ComponentTemplate;
  variant?: ComponentVariant;
  onInsert: (html: string) => void;
  isDark?: boolean;
  positionY?: number;
}

export const ComponentHoverPreviewCard: React.FC<ComponentHoverPreviewCardProps> = ({
  component,
  variant,
  onInsert,
  isDark = true,
  positionY = 60
}) => {
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>(isDark ? 'dark' : 'light');
  const [copied, setCopied] = useState(false);

  const activeHtml = variant ? variant.html : component.html;
  const activeName = variant ? variant.name : component.name;
  const activeDesc = variant ? variant.description : component.description;

  // Construct iframe srcDoc with Tailwind CSS loaded
  const iframeSrcDoc = useMemo(() => {
    const bgClass = previewTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900';
    return `<!DOCTYPE html>
<html class="${previewTheme}">
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: system-ui, -apple-system, sans-serif;
      overflow-x: hidden;
    }
    /* Hide scrollbars inside preview */
    ::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="${bgClass}">
  ${activeHtml}
</body>
</html>`;
  }, [activeHtml, previewTheme]);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(activeHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Clamp vertical position so it stays inside viewport
  const topPos = Math.max(70, Math.min(positionY, (window.innerHeight || 800) - 380));

  return (
    <div
      className={`fixed z-50 w-96 rounded-2xl border shadow-2xl transition-all duration-150 pointer-events-auto flex flex-col overflow-hidden animate-fade-in ${
        isDark 
          ? 'bg-slate-900/95 border-indigo-500/40 text-slate-100 backdrop-blur-md ring-1 ring-indigo-500/20' 
          : 'bg-white/95 border-slate-300 text-slate-900 backdrop-blur-md shadow-indigo-500/15'
      }`}
      style={{
        left: '325px',
        top: `${topPos}px`
      }}
    >
      {/* Browser Chrome Header Mock */}
      <div className={`px-3 py-2 border-b flex items-center justify-between text-xs ${
        isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 font-mono text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">
            preview://{component.id}{variant ? `/${variant.id}` : ''}
          </span>
        </div>

        {/* Theme Toggle inside preview */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-1 transition-colors ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
            title="Toggle preview frame theme"
          >
            {previewTheme === 'dark' ? <Moon className="w-3 h-3 text-indigo-400" /> : <Sun className="w-3 h-3 text-amber-500" />}
            <span className="uppercase text-[9px]">{previewTheme}</span>
          </button>
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="p-3 border-b border-slate-800/60 bg-gradient-to-r from-indigo-950/40 to-purple-950/40">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {component.category}
            </span>
            {variant && (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                <Layers className="w-2.5 h-2.5" />
                <span>{variant.name}</span>
              </span>
            )}
          </div>
          <span className="text-[10px] text-indigo-400 font-mono font-bold flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Layout Thumbnail</span>
          </span>
        </div>
        <h3 className="font-bold text-sm text-slate-100 leading-tight">
          {activeName}
        </h3>
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
          {activeDesc}
        </p>
      </div>

      {/* Mini Iframe Layout Snapshot Preview Box */}
      <div className="relative w-full h-48 bg-slate-950 overflow-hidden border-b border-slate-800/80">
        <iframe
          srcDoc={iframeSrcDoc}
          title={`Thumbnail snapshot of ${activeName}`}
          className="w-[200%] h-[200%] origin-top-left transform scale-50 border-0 pointer-events-none select-none bg-transparent"
          sandbox="allow-scripts"
        />

        {/* Hover watermark / scale badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-900/90 text-slate-400 text-[9px] font-mono rounded-md border border-slate-800 backdrop-blur-xs flex items-center space-x-1">
          <Eye className="w-3 h-3 text-indigo-400" />
          <span>0.50x Live Snapshot</span>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="p-3 bg-slate-950/90 flex items-center justify-between space-x-2">
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors border border-slate-700 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy HTML</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onInsert(activeHtml)}
          className="flex-1 py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Insert onto Canvas</span>
        </button>
      </div>
    </div>
  );
};
