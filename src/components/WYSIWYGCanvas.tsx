import React, { useEffect, useRef, useState } from 'react';
import { DeviceMode, SelectedElementInfo } from '../types';
import { Eye, Smartphone, Tablet, Monitor, RotateCw } from 'lucide-react';
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
  collaboratorCursors = {}
}) => {
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

  // Inject HTML + CSS + JS into iframe and attach interactive handlers
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Full HTML document payload
    const fullDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
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
              cursor: pointer !important;
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
      </html>
    `;

    doc.open();
    doc.write(fullDoc);
    doc.close();

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

      // Check if user clicked on a Draw.io diagram container
      const drawioParent = target.closest('.drawio-container') as HTMLElement;
      if (drawioParent && onOpenDrawIoWithDiagram) {
        const diagramId = drawioParent.getAttribute('data-diagram-id') || 'diagram-1';
        onOpenDrawIoWithDiagram(diagramId);
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
          // Clean temporary classes before syncing
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

    // Attach listeners
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
  }, [htmlContent, cssContent, jsContent, deviceMode, refreshKey]);

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
      className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-4 select-none"
    >
      {/* Device frame header tag & Reload Button */}
      <div className="absolute top-3 left-4 z-10 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-medium">WYSIWYG Visual Canvas</span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-indigo-400">{deviceMode.toUpperCase()} VIEW</span>

        <button
          onClick={handleManualRefresh}
          className="ml-1 flex items-center space-x-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-slate-700 transition-all cursor-pointer"
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
          title="WYSIWYG Canvas Frame"
          className="w-full h-full border-none bg-white dark:bg-slate-950"
        />
      </div>
    </div>
  );
};
