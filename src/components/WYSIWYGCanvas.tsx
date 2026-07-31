import React, { useEffect, useRef, useState } from 'react';
import { DeviceMode, SelectedElementInfo, ThemeMode } from '../types';
import { RotateCw } from 'lucide-react';
import { extractCanvasBodyHtml } from '../utils/svgUtils';

interface WYSIWYGCanvasProps {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  deviceMode: DeviceMode;
  onSelectElement: (info: SelectedElementInfo | null) => void;
  onUpdateHtmlFromCanvas: (newHtml: string) => void;
  onDeleteSelectedElement?: () => void;
  onOpenDrawIoWithDiagram?: (diagramId: string) => void;
  collaboratorCursors?: Record<string, { x: number; y: number; name: string; color: string }>;
  themeMode?: ThemeMode;
}

export const WYSIWYGCanvas: React.FC<WYSIWYGCanvasProps> = ({
  htmlContent,
  cssContent,
  jsContent,
  deviceMode,
  onSelectElement,
  onUpdateHtmlFromCanvas,
  onDeleteSelectedElement,
  onOpenDrawIoWithDiagram,
  collaboratorCursors = {},
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Helper to get device width class
  const getDeviceStyle = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'w-[375px] h-[667px] my-6 rounded-2xl shadow-2xl border-8 border-slate-800';
      case 'tablet':
        return 'w-[768px] h-[900px] my-6 rounded-xl shadow-2xl border-4 border-slate-800';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  // Full HTML document payload for iframe srcDoc
  const fullDoc = `<!DOCTYPE html>
<html class="${isDark ? 'dark' : ''}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class'
      };
    </script>
    <style>
      ${cssContent}
      .apex-hover-outline {
        outline: 2px dashed #818cf8 !important;
        outline-offset: 1px !important;
        cursor: pointer !important;
      }
      .apex-selected-outline {
        outline: 2px solid #6366f1 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25) !important;
      }
      .drawio-container {
        transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
      }
      /* Theme adaptation overrides for Draw.io diagram blocks */
      html:not(.dark) .drawio-container {
        background-color: #ffffff !important;
        color: #0f172a !important;
        border-color: #e2e8f0 !important;
        box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05) !important;
      }
      html:not(.dark) .diagram-viewport {
        background-color: #f8fafc !important;
        border-color: #e2e8f0 !important;
      }
      html:not(.dark) .diagram-viewport text {
        fill: #1e293b !important;
      }
      html.dark .drawio-container {
        background-color: #0f172a !important;
        color: #ffffff !important;
        border-color: #1e293b !important;
      }
      html.dark .diagram-viewport {
        background-color: #020617 !important;
        border-color: #1e293b !important;
      }
      html.dark .diagram-viewport text {
        fill: #e2e8f0 !important;
      }
    </style>
  </head>
  <body>
    <div id="apex-canvas-root">${extractCanvasBodyHtml(htmlContent)}</div>
    <script>
      try {
        ${jsContent}
      } catch(e) {
        console.error("User JS Error:", e);
      }
    </script>
  </body>
</html>`;

  // Attach interactive listeners inside iframe document safely
  const setupIframeListeners = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc || !doc.body) return;

    // Attach click & hover events inside iframe
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.id === 'apex-canvas-root' || target.tagName === 'BODY' || target.tagName === 'HTML') return;
      target.classList.add('apex-hover-outline');
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      target.classList.remove('apex-hover-outline');
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (!target || target.id === 'apex-canvas-root' || target.tagName === 'BODY' || target.tagName === 'HTML') {
        onSelectElement(null);
        return;
      }

      // Check if user explicitly clicked an "Edit Diagram" button to launch Draw.io editor
      const openDrawIoBtn = target.closest('[data-action="open-drawio"], .open-drawio-btn') as HTMLElement;
      if (openDrawIoBtn && onOpenDrawIoWithDiagram) {
        const drawioParent = target.closest('.drawio-container') as HTMLElement;
        const diagramId = drawioParent?.getAttribute('data-diagram-id') || 'diagram-1';
        onOpenDrawIoWithDiagram(diagramId);
        return;
      }

      // Clear previous selection outlines
      doc.querySelectorAll('.apex-selected-outline').forEach((el) => {
        el.classList.remove('apex-selected-outline');
      });

      target.classList.add('apex-selected-outline');

      // Build attribute record
      const attrs: Record<string, string> = {};
      Array.from(target.attributes).forEach((attr) => {
        if (!attr.name.startsWith('data-apex')) {
          attrs[attr.name] = attr.value;
        }
      });

      const elementInfo: SelectedElementInfo = {
        tagName: target.tagName,
        id: target.id || '',
        classList: Array.from(target.classList).filter((c) => !c.startsWith('apex-')),
        attributes: attrs,
        style: {},
        textContent: target.childNodes.length === 1 && target.childNodes[0].nodeType === 3
          ? target.textContent || ''
          : target.innerHTML || '',
      };

      onSelectElement(elementInfo);
    };

    // Handle Inline Text Editing inside Canvas
    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.id === 'apex-canvas-root') return;
      target.contentEditable = 'true';
      target.focus();

      const handleBlur = () => {
        target.contentEditable = 'false';
        const root = doc.getElementById('apex-canvas-root');
        if (root) {
          const cleanHtml = getCleanHtmlFromRoot(root);
          onUpdateHtmlFromCanvas(cleanHtml);
        }
        target.removeEventListener('blur', handleBlur);
      };
      target.addEventListener('blur', handleBlur);
    };

    // Handle keydown inside iframe for Delete/Backspace key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeTarget = doc.activeElement as HTMLElement;
        if (
          activeTarget &&
          (activeTarget.isContentEditable ||
            activeTarget.tagName === 'INPUT' ||
            activeTarget.tagName === 'TEXTAREA' ||
            activeTarget.closest('[contenteditable="true"]'))
        ) {
          return;
        }

        if (onDeleteSelectedElement) {
          e.preventDefault();
          onDeleteSelectedElement();
        }
      }
    };

    doc.addEventListener('mouseover', handleMouseOver);
    doc.addEventListener('mouseout', handleMouseOut);
    doc.addEventListener('click', handleClick);
    doc.addEventListener('dblclick', handleDblClick);
    doc.addEventListener('keydown', handleKeyDown);

    return () => {
      doc.removeEventListener('mouseover', handleMouseOver);
      doc.removeEventListener('mouseout', handleMouseOut);
      doc.removeEventListener('click', handleClick);
      doc.removeEventListener('dblclick', handleDblClick);
      doc.removeEventListener('keydown', handleKeyDown);
    };
  };

  useEffect(() => {
    const cleanup = setupIframeListeners();
    return () => {
      if (cleanup) cleanup();
    };
  }, [htmlContent, cssContent, jsContent, refreshKey]);

  // Extract clean HTML without editor helper classes
  const getCleanHtmlFromRoot = (rootEl: HTMLElement): string => {
    const clone = rootEl.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.apex-hover-outline, .apex-selected-outline').forEach((el) => {
      el.classList.remove('apex-hover-outline', 'apex-selected-outline');
    });
    return clone.innerHTML;
  };

  // Drag over & Drop handlers for inserting components onto canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedHtml = e.dataTransfer.getData('text/html') || e.dataTransfer.getData('text/plain');
    if (droppedHtml) {
      const iframe = iframeRef.current;
      const doc = iframe?.contentDocument;
      const root = doc?.getElementById('apex-canvas-root');
      if (root) {
        root.insertAdjacentHTML('beforeend', droppedHtml);
        const cleanHtml = getCleanHtmlFromRoot(root);
        onUpdateHtmlFromCanvas(cleanHtml);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden p-4 select-none transition-colors ${
        isDark ? 'bg-slate-950' : 'bg-slate-200/80'
      }`}
    >
      {/* Device frame header tag & Reload Button */}
      <div className={`absolute top-3 left-4 z-10 backdrop-blur px-3 py-1 rounded-full border text-[11px] flex items-center space-x-2.5 ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800 text-slate-400'
          : 'bg-white/90 border-slate-300 text-slate-600 shadow-sm'
      }`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-medium">WYSIWYG Visual Canvas</span>
        <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
        <span className="font-mono text-indigo-500 font-semibold">{deviceMode.toUpperCase()} VIEW</span>

        <button
          onClick={handleManualRefresh}
          className={`ml-1 flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
            isDark 
              ? 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300'
          }`}
          title="Reload / Refresh Visual Canvas"
        >
          <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>{isRefreshing ? 'Reloading...' : 'Reload Canvas'}</span>
        </button>
      </div>

      {/* Remote Collaborator Cursors Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {Object.entries(collaboratorCursors).map(([id, cursor]: [string, { x: number; y: number; name: string; color: string }]) => (
          <div
            key={id}
            style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }}
            className="absolute flex items-center space-x-1 transition-all duration-75 transform -translate-x-1/2 -translate-y-1/2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={cursor.color || '#6366f1'}>
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>
            <span
              style={{ backgroundColor: cursor.color || '#6366f1' }}
              className="text-[10px] text-white font-bold px-1.5 py-0.5 rounded shadow"
            >
              {cursor.name}
            </span>
          </div>
        ))}
      </div>

      {/* Embedded Render Iframe */}
      <div className={`transition-all duration-300 bg-white dark:bg-slate-900 ${getDeviceStyle()}`}>
        <iframe
          ref={iframeRef}
          key={`canvas-frame-${refreshKey}`}
          srcDoc={fullDoc}
          onLoad={setupIframeListeners}
          title="WYSIWYG Canvas Frame"
          className="w-full h-full border-none bg-white dark:bg-slate-950"
        />
      </div>
    </div>
  );
};
