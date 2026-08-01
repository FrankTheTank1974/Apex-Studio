import React, { useEffect, useRef, useState } from 'react';
import { DeviceMode, SelectedElementInfo, ThemeMode } from '../types';
import { RotateCw, Undo2, Redo2 } from 'lucide-react';
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
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
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
  themeMode = 'dark',
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
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
      /* Polished Canvas Hover Tooltip with Cloud Archiver Gradient Aesthetics */
      .apex-hover-tooltip {
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        display: none;
        align-items: center;
        gap: 6px;
        background: rgba(15, 23, 42, 0.94);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(99, 102, 241, 0.45);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.25);
        border-radius: 8px;
        padding: 4px 10px;
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        font-size: 11px;
        color: #f8fafc;
        white-space: nowrap;
        transform: translateY(-100%);
        transition: opacity 0.12s ease, transform 0.12s ease;
      }
      .apex-tooltip-badge {
        background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
        color: #ffffff;
        font-weight: 800;
        font-size: 10px;
        letter-spacing: 0.04em;
        padding: 2px 7px;
        border-radius: 5px;
        text-transform: lowercase;
        box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
        display: inline-flex;
        align-items: center;
      }
      .apex-tooltip-structure {
        color: #94a3b8;
        font-size: 10px;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
      }
      .apex-tooltip-id {
        color: #38bdf8;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 600;
        font-size: 10px;
      }
      .apex-tooltip-class {
        color: #a7f3d0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 10px;
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .apex-tooltip-dims {
        color: #64748b;
        font-size: 9px;
        font-weight: 600;
        margin-left: 2px;
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
    const showTooltip = (target: HTMLElement) => {
      let tooltip = doc.getElementById('apex-hover-tooltip');
      if (!tooltip) {
        tooltip = doc.createElement('div');
        tooltip.id = 'apex-hover-tooltip';
        tooltip.className = 'apex-hover-tooltip';
        doc.body.appendChild(tooltip);
      }

      const tagName = target.tagName.toLowerCase();
      const id = target.id ? `#${target.id}` : '';
      
      const cleanClasses = Array.from(target.classList || [])
        .filter((c) => !c.startsWith('apex-'))
        .slice(0, 3)
        .map((c) => `.${c}`)
        .join('');

      let parentBreadcrumb = '';
      if (target.parentElement && target.parentElement.id !== 'apex-canvas-root' && target.parentElement.tagName !== 'BODY') {
        const parentTag = target.parentElement.tagName.toLowerCase();
        parentBreadcrumb = `${parentTag} › `;
      }

      const rect = target.getBoundingClientRect();
      const dims = `${Math.round(rect.width)}×${Math.round(rect.height)}px`;

      tooltip.innerHTML = `
        <span class="apex-tooltip-badge">&lt;${tagName}&gt;</span>
        ${parentBreadcrumb ? `<span class="apex-tooltip-structure">${parentBreadcrumb}</span>` : ''}
        ${id ? `<span class="apex-tooltip-id">${id}</span>` : ''}
        ${cleanClasses ? `<span class="apex-tooltip-class" title="${cleanClasses}">${cleanClasses}</span>` : ''}
        <span class="apex-tooltip-dims">${dims}</span>
      `;

      tooltip.style.display = 'inline-flex';
      tooltip.style.opacity = '1';

      let left = rect.left;
      const tooltipWidth = tooltip.offsetWidth || 180;
      const winWidth = doc.defaultView?.innerWidth || 800;

      if (left + tooltipWidth > winWidth - 12) {
        left = Math.max(10, winWidth - tooltipWidth - 12);
      }
      if (left < 10) left = 10;

      let top = rect.top - 8;
      if (top < 32) {
        top = rect.bottom + 8;
        tooltip.style.transform = 'translateY(0)';
      } else {
        tooltip.style.transform = 'translateY(-100%)';
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const hideTooltip = () => {
      const tooltip = doc.getElementById('apex-hover-tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.id === 'apex-canvas-root' || target.tagName === 'BODY' || target.tagName === 'HTML' || target.id === 'apex-hover-tooltip' || target.closest('.apex-hover-tooltip')) {
        hideTooltip();
        return;
      }
      target.classList.add('apex-hover-outline');
      showTooltip(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      target.classList.remove('apex-hover-outline');
      hideTooltip();
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (!target || target.id === 'apex-canvas-root' || target.tagName === 'BODY' || target.tagName === 'HTML') {
        onSelectElement(null);
        return;
      }

      // Check if user explicitly clicked an "Edit Diagram" button to launch Draw.io editor
      const openDrawIoBtn = target.closest('.open-drawio-btn') as HTMLElement;
      if (openDrawIoBtn && onOpenDrawIoWithDiagram) {
        const drawioParent = target.closest('.drawio-container') as HTMLElement;
        const diagramId = drawioParent?.getAttribute('data-diagram-id') || 'diagram-1';
        onOpenDrawIoWithDiagram(diagramId);
        return;
      }

      // Check if user clicked on "Upload / Replace Media" button on a Media Card
      const uploadMediaBtn = target.closest('[data-action="upload-media"], .media-upload-btn') as HTMLElement;
      if (uploadMediaBtn) {
        e.preventDefault();
        const mediaContainer = (target.closest('.media-card, .media-container') as HTMLElement) || uploadMediaBtn.parentElement;
        
        let fileInput = doc.getElementById('apex-dynamic-file-input') as HTMLInputElement;
        if (!fileInput) {
          fileInput = doc.createElement('input');
          fileInput.id = 'apex-dynamic-file-input';
          fileInput.type = 'file';
          fileInput.accept = 'image/*,video/*';
          fileInput.style.display = 'none';
          doc.body.appendChild(fileInput);
        }

        fileInput.onchange = (evt: Event) => {
          const input = evt.target as HTMLInputElement;
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (readEvt) => {
              const dataUrl = readEvt.target?.result as string;
              const isVid = file.type.startsWith('video/');

              let mediaEl = mediaContainer?.querySelector('img, video, .media-element') as HTMLElement;
              if (!mediaEl && mediaContainer) {
                mediaEl = mediaContainer;
              }

              if (isVid) {
                const videoEl = doc.createElement('video');
                videoEl.controls = true;
                videoEl.src = dataUrl;
                videoEl.className = mediaEl?.className || 'w-full h-52 object-cover media-element';
                if (mediaEl && mediaEl.parentNode && mediaEl.parentNode !== mediaContainer) {
                  mediaEl.parentNode.replaceChild(videoEl, mediaEl);
                } else if (mediaContainer) {
                  const existing = mediaContainer.querySelector('img, video');
                  if (existing) existing.remove();
                  mediaContainer.insertBefore(videoEl, mediaContainer.firstChild);
                }
              } else {
                if (mediaEl && mediaEl.tagName.toLowerCase() === 'img') {
                  (mediaEl as HTMLImageElement).src = dataUrl;
                } else {
                  const imgEl = doc.createElement('img');
                  imgEl.src = dataUrl;
                  imgEl.alt = 'Uploaded media';
                  imgEl.className = mediaEl?.className || 'w-full h-48 object-cover media-element';
                  if (mediaEl && mediaEl.parentNode && mediaEl.parentNode !== mediaContainer) {
                    mediaEl.parentNode.replaceChild(imgEl, mediaEl);
                  } else if (mediaContainer) {
                    const existing = mediaContainer.querySelector('img, video');
                    if (existing) existing.remove();
                    mediaContainer.insertBefore(imgEl, mediaContainer.firstChild);
                  }
                }
              }

              const root = doc.getElementById('apex-canvas-root');
              if (root) {
                onUpdateHtmlFromCanvas(getCleanHtmlFromRoot(root));
              }
            };
            reader.readAsDataURL(file);
          }
        };
        fileInput.click();
        return;
      }

      // Clear previous selection outlines
      doc.querySelectorAll('.apex-selected-outline').forEach((el) => {
        el.classList.remove('apex-selected-outline');
      });

      // If user clicked inside an SVG or Draw.io container, select the container or SVG element for clean diagram outline
      const drawioContainer = target.closest('.drawio-container') as HTMLElement | null;
      const svgElement = (target.closest('svg') as unknown) as HTMLElement | null;
      const selectTarget = (drawioContainer || svgElement || target) as HTMLElement;

      selectTarget.classList?.add('apex-selected-outline');

      // Build attribute record safely
      const attrs: Record<string, string> = {};
      if (selectTarget.attributes) {
        Array.from(selectTarget.attributes).forEach((attr) => {
          if (!attr.name.startsWith('data-apex')) {
            attrs[attr.name] = attr.value;
          }
        });
      }

      const elementInfo: SelectedElementInfo = {
        tagName: selectTarget.tagName || 'DIV',
        id: selectTarget.id || '',
        classList: selectTarget.classList ? Array.from(selectTarget.classList).filter((c) => !c.startsWith('apex-')) : [],
        attributes: attrs,
        style: {},
        textContent: selectTarget.childNodes && selectTarget.childNodes.length === 1 && selectTarget.childNodes[0].nodeType === 3
          ? selectTarget.textContent || ''
          : selectTarget.innerHTML || '',
      };

      onSelectElement(elementInfo);
    };

    // Handle Inline Text Editing & Draw.io Diagram Double-Click Launch inside Canvas
    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.id === 'apex-canvas-root') return;

      // Double-clicking a Draw.io diagram container or SVG opens the Draw.io editor modal!
      const drawioParent = target.closest('.drawio-container, .diagram-viewport') as HTMLElement;
      if (drawioParent && onOpenDrawIoWithDiagram) {
        const diagramId = drawioParent.getAttribute('data-diagram-id') || 
                          drawioParent.closest('[data-diagram-id]')?.getAttribute('data-diagram-id') || 
                          'diagram-1';
        onOpenDrawIoWithDiagram(diagramId);
        return;
      }

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

    // Handle keydown inside iframe for Undo/Redo & Delete/Backspace key
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isCmdOrCtrl && (key === 'z' || key === 'y')) {
        const activeTarget = doc.activeElement as HTMLElement;
        const isEditingText = activeTarget && (
          activeTarget.isContentEditable ||
          activeTarget.tagName === 'INPUT' ||
          activeTarget.tagName === 'TEXTAREA' ||
          activeTarget.closest('[contenteditable="true"]')
        );

        if (!isEditingText) {
          e.preventDefault();
          if (key === 'y' || (key === 'z' && e.shiftKey)) {
            if (onRedo) onRedo();
          } else {
            if (onUndo) onUndo();
          }
          return;
        }
      }

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

    // Handle file drop directly onto iframe content/cards
    const handleIframeDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleIframeDrop = (e: DragEvent) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          e.preventDefault();
          e.stopPropagation();
          const target = e.target as HTMLElement;
          const mediaContainer = (target?.closest('.media-card, .media-container') as HTMLElement) || target;

          const reader = new FileReader();
          reader.onload = (readEvt) => {
            const dataUrl = readEvt.target?.result as string;
            const isVid = file.type.startsWith('video/');

            let mediaEl = mediaContainer?.querySelector('img, video, .media-element') as HTMLElement;
            if (!mediaEl && ['IMG', 'VIDEO'].includes(target.tagName)) {
              mediaEl = target;
            }

            if (isVid) {
              const videoEl = doc.createElement('video');
              videoEl.controls = true;
              videoEl.src = dataUrl;
              videoEl.className = mediaEl?.className || 'w-full h-52 object-cover media-element';
              if (mediaEl && mediaEl.parentNode && mediaEl.parentNode !== mediaContainer) {
                mediaEl.parentNode.replaceChild(videoEl, mediaEl);
              } else if (mediaContainer) {
                const existing = mediaContainer.querySelector('img, video');
                if (existing) existing.remove();
                mediaContainer.insertBefore(videoEl, mediaContainer.firstChild);
              }
            } else {
              if (mediaEl && mediaEl.tagName.toLowerCase() === 'img') {
                (mediaEl as HTMLImageElement).src = dataUrl;
              } else {
                const imgEl = doc.createElement('img');
                imgEl.src = dataUrl;
                imgEl.alt = 'Uploaded media';
                imgEl.className = mediaEl?.className || 'w-full h-48 object-cover media-element';
                if (mediaEl && mediaEl.parentNode && mediaEl.parentNode !== mediaContainer) {
                  mediaEl.parentNode.replaceChild(imgEl, mediaEl);
                } else if (mediaContainer) {
                  const existing = mediaContainer.querySelector('img, video');
                  if (existing) existing.remove();
                  mediaContainer.insertBefore(imgEl, mediaContainer.firstChild);
                }
              }
            }

            const root = doc.getElementById('apex-canvas-root');
            if (root) {
              onUpdateHtmlFromCanvas(getCleanHtmlFromRoot(root));
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    doc.addEventListener('mouseover', handleMouseOver);
    doc.addEventListener('mouseout', handleMouseOut);
    doc.addEventListener('click', handleClick);
    doc.addEventListener('dblclick', handleDblClick);
    doc.addEventListener('keydown', handleKeyDown);
    doc.addEventListener('dragover', handleIframeDragOver);
    doc.addEventListener('drop', handleIframeDrop);

    return () => {
      doc.removeEventListener('mouseover', handleMouseOver);
      doc.removeEventListener('mouseout', handleMouseOut);
      doc.removeEventListener('click', handleClick);
      doc.removeEventListener('dblclick', handleDblClick);
      doc.removeEventListener('keydown', handleKeyDown);
      doc.removeEventListener('dragover', handleIframeDragOver);
      doc.removeEventListener('drop', handleIframeDrop);
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
    clone.querySelectorAll('.apex-hover-outline, .apex-selected-outline, #apex-hover-tooltip, .apex-hover-tooltip').forEach((el) => {
      el.classList.remove('apex-hover-outline', 'apex-selected-outline');
      if (el.id === 'apex-hover-tooltip' || el.classList.contains('apex-hover-tooltip')) {
        el.remove();
      }
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

        <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>|</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1 rounded-full text-[10px] font-semibold border transition-all flex items-center ${
              canUndo
                ? isDark
                  ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700 cursor-pointer'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300 cursor-pointer shadow-xs'
                : isDark ? 'text-slate-600 opacity-40 cursor-not-allowed border-transparent' : 'text-slate-400 opacity-40 cursor-not-allowed border-transparent'
            }`}
            title="Undo Canvas Action (Ctrl+Z)"
          >
            <Undo2 className="w-3 h-3" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1 rounded-full text-[10px] font-semibold border transition-all flex items-center ${
              canRedo
                ? isDark
                  ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700 cursor-pointer'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-300 cursor-pointer shadow-xs'
                : isDark ? 'text-slate-600 opacity-40 cursor-not-allowed border-transparent' : 'text-slate-400 opacity-40 cursor-not-allowed border-transparent'
            }`}
            title="Redo Canvas Action (Ctrl+Y / Cmd+Shift+Z)"
          >
            <Redo2 className="w-3 h-3" />
          </button>
        </div>

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
