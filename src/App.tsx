/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ProjectFile, 
  ViewMode, 
  DeviceMode, 
  ThemeMode,
  SelectedElementInfo, 
  Collaborator, 
  ChatMessage, 
  DrawIoDiagram,
  FileType
} from './types';
import { transpileTypeScript } from './utils/tsTranspiler';
import { transpileGroovyToJS } from './utils/groovyEngine';
import { INITIAL_DEFAULT_FILES } from './data/componentsData';
import { Navbar } from './components/Navbar';
import { ComponentLibrary } from './components/ComponentLibrary';
import { WYSIWYGCanvas } from './components/WYSIWYGCanvas';
import { InspectorPanel } from './components/InspectorPanel';
import { CodeEditor } from './components/CodeEditor';
import { DrawIoEditor } from './components/DrawIoEditor';
import { CollaborationBar } from './components/CollaborationBar';
import { ExportDeployModal } from './components/ExportDeployModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { NewProjectModal } from './components/NewProjectModal';
import { GoogleFontsModal } from './components/GoogleFontsModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { HostedPreviewModal } from './components/HostedPreviewModal';
import { ImportUrlModal } from './components/ImportUrlModal';
import { MediaListModal } from './components/MediaListModal';
import { QuickLinkModal } from './components/QuickLinkModal';
import { HeadTagsSEOModal } from './components/HeadTagsSEOModal';
import { IconPickerModal } from './components/IconPickerModal';
import { SqlDatabaseExplorerModal } from './components/SqlDatabaseExplorerModal';
import { getWebPolicyDefaultContent } from './data/webPolicyTemplates';
import { downloadTarZstd } from './utils/tarZstd';
import { normalizeSvgContent, serializeDocumentOrBody } from './utils/svgUtils';

export default function App() {
  const [projectName, setProjectName] = useState('ApexStudio Project');
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('index-html');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('apex_theme_mode');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });
  const [selectedElement, setSelectedElement] = useState<SelectedElementInfo | null>(null);

  const handleToggleTheme = () => {
    setThemeMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('apex_theme_mode', next);
      return next;
    });
  };

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDrawIoOpen, setIsDrawIoOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isFontsOpen, setIsFontsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isHostedPreviewOpen, setIsHostedPreviewOpen] = useState(false);
  const [isImportUrlOpen, setIsImportUrlOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isQuickLinkOpen, setIsQuickLinkOpen] = useState(false);
  const [isSEOOpen, setIsSEOOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isSqlDbOpen, setIsSqlDbOpen] = useState(false);

  // Active Draw.io diagram state
  const [activeDiagram, setActiveDiagram] = useState<DrawIoDiagram | null>(null);

  // Undo / Redo History Stacks
  const [historyPast, setHistoryPast] = useState<string[]>([]);
  const [historyFuture, setHistoryFuture] = useState<string[]>([]);

  // Real-time Collaboration States
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<Record<string, { x: number; y: number; name: string; color: string }>>({});
  const wsRef = useRef<WebSocket | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const activeHtmlFile = activeFile?.type === 'html'
    ? activeFile
    : (files.find((f) => f.type === 'html') || files[0]);
  const activeCssFile = files.find((f) => f.type === 'css') || files[1];
  const activeJsFile = files.find((f) => f.type === 'js') || files[2];

  // WebSocket Connection Handler
  useEffect(() => {
    if (!activeRoomId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'join_room',
          roomId: activeRoomId,
          userId: 'user-' + Math.random().toString(36).substr(2, 5),
          userName: 'Developer-' + Math.floor(100 + Math.random() * 800),
          userColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
          initialFiles: files,
        })
      );
    };

    socket.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);

        if (msg.type === 'room_joined' || msg.type === 'user_joined' || msg.type === 'user_left') {
          if (msg.users) setCollaborators(msg.users);
          if (msg.files && msg.files.length > 0) setFiles(msg.files);
          if (msg.chat) setChatMessages(msg.chat);
        } else if (msg.type === 'files_synced') {
          setFiles(msg.files);
        } else if (msg.type === 'cursor_moved') {
          setRemoteCursors((prev) => ({
            ...prev,
            [msg.userId]: {
              x: msg.cursor.x,
              y: msg.cursor.y,
              name: msg.userName,
              color: msg.userColor,
            },
          }));
        } else if (msg.type === 'new_chat_message') {
          setChatMessages((prev) => [...prev, msg.message]);
        }
      } catch (err) {
        console.error('WS Parse Error:', err);
      }
    };

    return () => {
      socket.close();
    };
  }, [activeRoomId]);

  // Sync files over WebSocket when updated locally
  const broadcastFileUpdate = (updatedFiles: ProjectFile[]) => {
    setFiles(updatedFiles);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeRoomId) {
      wsRef.current.send(
        JSON.stringify({
          type: 'sync_files',
          files: updatedFiles,
        })
      );
    }
  };

  // Update HTML content from Code Editor or Canvas
  const handleUpdateHtml = (newHtml: string, skipHistory = false) => {
    const currentHtml = activeHtmlFile?.content || '';
    if (newHtml === currentHtml) return;

    if (!skipHistory) {
      setHistoryPast((prev) => {
        const updated = [...prev, currentHtml];
        return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
      });
      setHistoryFuture([]);
    }

    const updated = files.map((f) => (f.id === activeHtmlFile?.id ? { ...f, content: newHtml } : f));
    broadcastFileUpdate(updated);
  };

  // Perform Undo Action
  const handleUndo = () => {
    if (historyPast.length === 0 || !activeHtmlFile) return;

    const previousHtml = historyPast[historyPast.length - 1];
    const newPast = historyPast.slice(0, historyPast.length - 1);

    setHistoryFuture((prev) => [activeHtmlFile.content, ...prev]);
    setHistoryPast(newPast);
    setSelectedElement(null);

    handleUpdateHtml(previousHtml, true);
  };

  // Perform Redo Action
  const handleRedo = () => {
    if (historyFuture.length === 0 || !activeHtmlFile) return;

    const nextHtml = historyFuture[0];
    const newFuture = historyFuture.slice(1);

    setHistoryPast((prev) => [...prev, activeHtmlFile.content]);
    setHistoryFuture(newFuture);
    setSelectedElement(null);

    handleUpdateHtml(nextHtml, true);
  };

  // Update File content from Code Editor
  const handleFileContentChange = (fileId: string, newContent: string) => {
    if (activeHtmlFile && fileId === activeHtmlFile.id) {
      handleUpdateHtml(newContent, false);
    } else {
      const updated = files.map((f) => (f.id === fileId ? { ...f, content: newContent } : f));
      broadcastFileUpdate(updated);
    }
  };

  // Insert HTML component from library or AI assistant
  const handleInsertComponentHtml = (componentHtml: string) => {
    if (!activeHtmlFile) return;

    let currentHtml = activeHtmlFile.content;

    // If there is a closing </body> tag, insert before it; otherwise append
    if (currentHtml.includes('</body>')) {
      currentHtml = currentHtml.replace('</body>', `  ${componentHtml}\n</body>`);
    } else {
      currentHtml += `\n${componentHtml}`;
    }

    handleUpdateHtml(currentHtml);
  };

  // Update element properties from Inspector Panel
  const handleUpdateSelectedElement = (updatedInfo: Partial<SelectedElementInfo>) => {
    if (!selectedElement || !activeHtmlFile) return;

    // Parse HTML document DOM to make targeted element update
    const parser = new DOMParser();
    const doc = parser.parseFromString(activeHtmlFile.content, 'text/html');

    // Find target element by tag and text or id
    let targetEl: Element | null = null;
    if (selectedElement.id) {
      targetEl = doc.getElementById(selectedElement.id);
    }

    if (!targetEl && selectedElement.tagName) {
      const candidates = doc.querySelectorAll(selectedElement.tagName);
      candidates.forEach((el) => {
        if (el.textContent?.trim() === selectedElement.textContent.trim()) {
          targetEl = el;
        }
      });
    }

    if (!targetEl) return;

    // Update text content
    if (updatedInfo.textContent !== undefined) {
      targetEl.textContent = updatedInfo.textContent;
    }

    // Update classList
    if (updatedInfo.classList) {
      targetEl.className = updatedInfo.classList.join(' ');
    }

    // Update attributes
    if (updatedInfo.attributes) {
      Object.entries(updatedInfo.attributes).forEach(([k, v]) => {
        if (v) {
          targetEl?.setAttribute(k, v);
        } else {
          targetEl?.removeAttribute(k);
        }
      });
    }

    const updatedHtml = serializeDocumentOrBody(doc, activeHtmlFile.content);
    handleUpdateHtml(updatedHtml);
  };

  // Duplicate / Delete / Move Selected Element
  const handleDuplicateElement = () => {
    if (!selectedElement || !activeHtmlFile) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(activeHtmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    if (selectedElement.id) targetEl = doc.getElementById(selectedElement.id);
    if (!targetEl) {
      const candidates = doc.querySelectorAll(selectedElement.tagName);
      candidates.forEach((el) => {
        if (el.textContent?.trim() === selectedElement.textContent.trim()) targetEl = el;
      });
    }

    if (targetEl && targetEl.parentNode) {
      const clone = targetEl.cloneNode(true);
      targetEl.parentNode.insertBefore(clone, targetEl.nextSibling);
      const updatedHtml = serializeDocumentOrBody(doc, activeHtmlFile.content);
      handleUpdateHtml(updatedHtml);
    }
  };

  const handleDeleteElement = () => {
    if (!selectedElement || !activeHtmlFile) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(activeHtmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    if (selectedElement.id) targetEl = doc.getElementById(selectedElement.id);
    if (!targetEl) {
      const candidates = doc.querySelectorAll(selectedElement.tagName);
      candidates.forEach((el) => {
        if (el.textContent?.trim() === selectedElement.textContent.trim()) targetEl = el;
      });
    }

    if (targetEl && targetEl.parentNode) {
      targetEl.parentNode.removeChild(targetEl);
      setSelectedElement(null);
      const updatedHtml = serializeDocumentOrBody(doc, activeHtmlFile.content);
      handleUpdateHtml(updatedHtml);
    }
  };

  // Fetch server config (enterprise AI compliance policies)
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.aiEnabled === 'boolean') {
          setAiEnabled(data.aiEnabled);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut listener for Delete/Backspace key, Ctrl+Z / Cmd+Z Undo/Redo, and global hotkeys
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      const activeEl = document.activeElement;

      const isInputOrEditable =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable) ||
        activeEl?.closest('input') ||
        activeEl?.closest('textarea') ||
        activeEl?.closest('.monaco-editor') ||
        activeEl?.closest('[contenteditable="true"]');

      // Global hotkey: '?' to toggle keyboard shortcuts modal
      if ((e.key === '?' || (isCmdOrCtrl && key === '/')) && !isInputOrEditable) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Global hotkey: Ctrl/Cmd + K for AI Copilot
      if (isCmdOrCtrl && key === 'k') {
        e.preventDefault();
        if (aiEnabled) {
          setIsAIOpen((prev) => !prev);
        }
        return;
      }

      // Global hotkey: Alt + H or Ctrl/Cmd + Shift + H for Hosted Webpage Preview
      if ((e.altKey && key === 'h') || (isCmdOrCtrl && e.shiftKey && key === 'h')) {
        e.preventDefault();
        setIsHostedPreviewOpen((prev) => !prev);
        return;
      }

      // View mode switching: Alt + 1/2/3/4
      if (e.altKey && !isCmdOrCtrl && !e.shiftKey) {
        if (key === '1') { e.preventDefault(); setViewMode('wysiwyg'); return; }
        if (key === '2') { e.preventDefault(); setViewMode('split'); return; }
        if (key === '3') { e.preventDefault(); setViewMode('code'); return; }
        if (key === '4') { e.preventDefault(); setViewMode('preview'); return; }
      }

      if (isCmdOrCtrl && (key === 'z' || key === 'y')) {
        if (!isInputOrEditable) {
          e.preventDefault();
          if (key === 'y' || (key === 'z' && e.shiftKey)) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        if (!isInputOrEditable) {
          e.preventDefault();
          handleDeleteElement();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [selectedElement, activeHtmlFile, historyPast, historyFuture]);

  const handleMoveElement = (direction: 'up' | 'down') => {
    if (!selectedElement || !activeHtmlFile) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(activeHtmlFile.content, 'text/html');

    let targetEl: Element | null = null;
    if (selectedElement.id) targetEl = doc.getElementById(selectedElement.id);
    if (!targetEl) {
      const candidates = doc.querySelectorAll(selectedElement.tagName);
      candidates.forEach((el) => {
        if (el.textContent?.trim() === selectedElement.textContent.trim()) targetEl = el;
      });
    }

    if (targetEl && targetEl.parentNode) {
      if (direction === 'up' && targetEl.previousElementSibling) {
        targetEl.parentNode.insertBefore(targetEl, targetEl.previousElementSibling);
      } else if (direction === 'down' && targetEl.nextElementSibling) {
        targetEl.parentNode.insertBefore(targetEl.nextElementSibling, targetEl);
      }
      const updatedHtml = serializeDocumentOrBody(doc, activeHtmlFile.content);
      handleUpdateHtml(updatedHtml);
    }
  };

  // Open Draw.io with specific diagram ID
  const handleOpenDrawIoWithDiagram = (diagramId?: string) => {
    if (diagramId && activeHtmlFile) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(activeHtmlFile.content, 'text/html');
      const container = doc.querySelector(`[data-diagram-id="${diagramId}"]`) || doc.querySelector('.drawio-container');
      if (container) {
        const titleEl = container.querySelector('span.font-bold');
        const title = titleEl?.textContent?.trim() || 'Architecture Diagram';
        const svgEl = container.querySelector('svg');
        const svg = svgEl ? svgEl.outerHTML : '';
        
        setActiveDiagram((prev) => ({
          id: diagramId,
          title,
          xml: prev?.id === diagramId ? prev.xml : '',
          svg,
          updatedAt: new Date().toISOString(),
        }));
      }
    }
    setIsDrawIoOpen(true);
  };

  // Handle Save / Upgrade Draw.io Diagram
  const handleSaveDrawIoDiagram = (diagram: DrawIoDiagram) => {
    setActiveDiagram(diagram);
    if (!activeHtmlFile) return;

    const normalizedSvg = normalizeSvgContent(diagram.svg);

    const parser = new DOMParser();
    const doc = parser.parseFromString(activeHtmlFile.content, 'text/html');

    const diagramHtml = `<div class="my-8 p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-lg drawio-container relative group" data-diagram-id="${diagram.id}">
  <div class="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
    <div class="flex items-center space-x-2">
      <span class="text-amber-500 font-bold">❖</span>
      <span class="diagram-title font-bold text-sm tracking-wide">${diagram.title}</span>
    </div>
    <div class="flex items-center space-x-2">
      <span class="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-full border border-amber-500/30 font-medium">Draw.io Vector</span>
      <button type="button" data-action="open-drawio" class="open-drawio-btn text-xs px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium cursor-pointer">Edit Diagram</button>
    </div>
  </div>
  <div data-action="open-drawio" class="diagram-viewport cursor-pointer p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center">
    ${normalizedSvg || `<div class="text-amber-500 font-bold p-8">Diagram SVG updated</div>`}
  </div>
</div>`;

    let targetContainer = doc.querySelector(`[data-diagram-id="${diagram.id}"]`);
    if (!targetContainer) {
      targetContainer = doc.querySelector('.drawio-container');
    }

    if (targetContainer) {
      const tempDiv = doc.createElement('div');
      tempDiv.innerHTML = diagramHtml.trim();
      const newEl = tempDiv.firstElementChild;
      if (newEl && targetContainer.parentNode) {
        targetContainer.parentNode.replaceChild(newEl, targetContainer);
      }
      const newHtml = serializeDocumentOrBody(doc, activeHtmlFile.content);
      handleUpdateHtml(newHtml);
    } else {
      handleInsertComponentHtml(diagramHtml);
    }
  };

  // Add Custom File to project
  const handleAddNewFile = (name: string, type: FileType, initialContent?: string) => {
    const rawTitle = name.replace(/\.(html|css|js|ts|groovy|xml|json|txt)$/i, '').split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    const pageTitle = rawTitle || 'New File';

    let defaultContent = initialContent || '';
    if (!initialContent) {
      const webPolicyContent = getWebPolicyDefaultContent(name);
      if (webPolicyContent) {
        defaultContent = webPolicyContent;
      } else if (type === 'html') {
        defaultContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen font-sans">
  <!-- Navigation Header -->
  <header class="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="index.html" class="flex items-center space-x-2 font-bold text-lg text-white">
        <span class="text-indigo-500">✦</span>
        <span>My App Studio</span>
      </a>
      <nav class="flex items-center space-x-6 text-sm font-medium">
        <a href="index.html" class="text-slate-400 hover:text-white transition-colors">Home</a>
        <a href="${name}" class="text-indigo-400 font-bold border-b-2 border-indigo-500 pb-1">${pageTitle}</a>
      </nav>
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="max-w-5xl mx-auto px-6 py-16">
    <div id="${name.replace(/\.html$/i, '')}-hero" class="text-center space-y-4">
      <span class="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
        ${pageTitle}
      </span>
      <h1 class="text-4xl font-extrabold text-white tracking-tight">${pageTitle} Page</h1>
      <p class="text-slate-400 max-w-xl mx-auto text-base">
        Welcome to the ${pageTitle} page. Edit this layout visually using drag-and-drop components or the code editor.
      </p>
      <div class="pt-4">
        <a href="index.html" class="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all">
          <span>← Back to Home</span>
        </a>
      </div>
    </div>
  </main>
</body>
</html>`;
      } else if (type === 'css') {
        defaultContent = '/* Custom Stylesheet */';
      } else if (type === 'js') {
        defaultContent = '// Custom JavaScript';
      } else if (type === 'ts') {
        defaultContent = `// TypeScript Module\nexport interface AppConfig {\n  id: string;\n  enabled: boolean;\n}\n\nexport class Service {\n  static init(cfg: AppConfig): void {\n    console.log(\`[TS] Initialized service \${cfg.id}\`);\n  }\n}\n\nService.init({ id: 'srv-1', enabled: true });`;
      } else if (type === 'groovy') {
        defaultContent = `// GroovyScript Logic\ndef user = "Developer"\ndef range = (1..5)\n\nprintln "⚡ GroovyScript initialized for \${user}"\nprintln "Range: \${range}"\nprintln "Sum: \${range.sum()}"`;
      } else if (type === 'xml') {
        defaultContent = `<?xml version="1.0" encoding="UTF-8"?>\n<config>\n  <name>${pageTitle}</name>\n</config>`;
      } else if (type === 'json') {
        defaultContent = `{\n  "title": "${pageTitle}",\n  "status": "active"\n}`;
      } else if (type === 'txt') {
        defaultContent = `# Plain Text File: ${name}\n\n`;
      }
    }

    const newFile: ProjectFile = {
      id: 'file-' + Date.now(),
      name,
      type,
      path: `/${name}`,
      content: defaultContent,
    };
    const updated = [...files, newFile];
    broadcastFileUpdate(updated);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (fileId: string) => {
    const updated = files.filter((f) => f.id !== fileId);
    broadcastFileUpdate(updated);
    if (activeFileId === fileId) {
      setActiveFileId(updated[0]?.id || 'index-html');
    }
  };

  // Import webpage by URL handler
  const handleImportWebpage = (htmlContent: string, cssContent: string, jsContent: string) => {
    if (activeHtmlFile) {
      setHistoryPast((prev) => [...prev, activeHtmlFile.content]);
      setHistoryFuture([]);
    }

    const updatedFiles = files.map((f) => {
      if (f.id === 'index-html' || f.type === 'html') {
        return { ...f, content: htmlContent };
      }
      if ((f.id === 'styles-css' || f.type === 'css') && cssContent) {
        return { ...f, content: cssContent };
      }
      if ((f.id === 'script-js' || f.type === 'js') && jsContent) {
        return { ...f, content: jsContent };
      }
      return f;
    });

    broadcastFileUpdate(updatedFiles);
  };

  // Initialize / Create new project
  const handleCreateNewProject = (newTitle: string, newFiles: ProjectFile[]) => {
    setProjectName(newTitle);
    broadcastFileUpdate(newFiles);
    setActiveFileId(newFiles[0]?.id || 'index-html');
    setSelectedElement(null);
  };

  // Download .tar.zst archive directly
  const handleExportZstArchive = () => {
    const archiveFiles = files.map((f) => ({
      name: f.name,
      content: f.content,
    }));
    archiveFiles.push({
      name: 'README.md',
      content: `# ${projectName}\n\nGenerated with ApexStudio WYSIWYG Editor.\nContains complete project assets and HTML structure.`,
    });
    downloadTarZstd(`${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.tar.zst`, archiveFiles);
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans select-none transition-colors ${
      themeMode === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        aiEnabled={aiEnabled}
        onOpenDrawIo={() => setIsDrawIoOpen(true)}
        onOpenFonts={() => setIsFontsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenHostedPreview={() => setIsHostedPreviewOpen(true)}
        onOpenImportUrl={() => setIsImportUrlOpen(true)}
        onOpenMedia={() => setIsMediaOpen(true)}
        onOpenQuickLinkModal={() => setIsQuickLinkOpen(true)}
        onOpenSEOModal={() => setIsSEOOpen(true)}
        onOpenIconPicker={() => setIsIconPickerOpen(true)}
        onOpenSqlDb={() => setIsSqlDbOpen(true)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onExportZst={handleExportZstArchive}
        activeRoomId={activeRoomId}
        onToggleCollab={() => setIsCollabOpen(!isCollabOpen)}
        collaboratorCount={collaborators.length}
        canUndo={historyPast.length > 0}
        canRedo={historyFuture.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Main Studio Workbench Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Component Drag & Drop Palette (WYSIWYG or Split mode) */}
        {(viewMode === 'wysiwyg' || viewMode === 'split') && (
          <ComponentLibrary
            onInsertComponent={handleInsertComponentHtml}
            onOpenIconPicker={() => setIsIconPickerOpen(true)}
            themeMode={themeMode}
          />
        )}

        {/* Center Canvas / Code Split Views */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* WYSIWYG Visual View (Visible in WYSIWYG, Split, Preview) */}
          {viewMode !== 'code' && (() => {
            const activeJs = activeJsFile?.content || '';
            const tsTranspiled = files
              .filter((f) => f.type === 'ts')
              .map((f) => `/* ${f.name} (Transpiled TS) */\n${transpileTypeScript(f.content).code}`)
              .join('\n\n');
            const groovyTranspiled = files
              .filter((f) => f.type === 'groovy')
              .map((f) => `/* ${f.name} (Transpiled Groovy) */\n${transpileGroovyToJS(f.content)}`)
              .join('\n\n');

            const effectiveJsContent = [activeJs, tsTranspiled, groovyTranspiled].filter(Boolean).join('\n\n');

            return (
              <WYSIWYGCanvas
                htmlContent={activeHtmlFile?.content || ''}
                cssContent={activeCssFile?.content || ''}
                jsContent={effectiveJsContent}
                deviceMode={viewMode === 'preview' ? 'desktop' : deviceMode}
                onSelectElement={setSelectedElement}
                onUpdateHtmlFromCanvas={handleUpdateHtml}
                onDeleteSelectedElement={handleDeleteElement}
                onOpenDrawIoWithDiagram={handleOpenDrawIoWithDiagram}
                collaboratorCursors={remoteCursors}
                themeMode={themeMode}
                canUndo={historyPast.length > 0}
                canRedo={historyFuture.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onOpenHostedPreview={() => setIsHostedPreviewOpen(true)}
              />
            );
          })()}

          {/* Code Editors View (Visible in Code or Split mode) */}
          {(viewMode === 'code' || viewMode === 'split') && (
            <CodeEditor
              files={files}
              activeFileId={activeFileId}
              onSelectFile={setActiveFileId}
              onFileContentChange={handleFileContentChange}
              onAddNewFile={handleAddNewFile}
              onDeleteFile={handleDeleteFile}
              onOpenSqlDb={() => setIsSqlDbOpen(true)}
              themeMode={themeMode}
            />
          )}
        </div>

        {/* Right Inspector Sidebar (Visible in WYSIWYG or Split mode) */}
        {(viewMode === 'wysiwyg' || viewMode === 'split') && (
          <InspectorPanel
            selectedElement={selectedElement}
            onUpdateElement={handleUpdateSelectedElement}
            onDuplicateElement={handleDuplicateElement}
            onDeleteElement={handleDeleteElement}
            onMoveElement={handleMoveElement}
            onOpenDrawIoWithDiagram={handleOpenDrawIoWithDiagram}
            onOpenFonts={() => setIsFontsOpen(true)}
            onOpenQuickLinkModal={() => setIsQuickLinkOpen(true)}
            cssContent={activeCssFile?.content || ''}
            activeHtmlContent={activeHtmlFile?.content || ''}
            files={files}
            onUpdateCssContent={(newCss) => handleFileContentChange(activeCssFile?.id || 'styles-css', newCss)}
            onUpdateHtmlContent={(newHtml) => handleUpdateHtml(newHtml)}
            onRestoreFiles={(restoredFiles) => broadcastFileUpdate(restoredFiles)}
            themeMode={themeMode}
          />
        )}
      </div>

      {/* Google Fonts Studio Utility Modal */}
      <GoogleFontsModal
        isOpen={isFontsOpen}
        onClose={() => setIsFontsOpen(false)}
        cssContent={activeCssFile?.content || ''}
        onUpdateCssContent={(newCss) => handleFileContentChange(activeCssFile?.id || 'styles-css', newCss)}
        themeMode={themeMode}
      />

      {/* Draw.io Integrated Editor Modal */}
      <DrawIoEditor
        isOpen={isDrawIoOpen}
        onClose={() => setIsDrawIoOpen(false)}
        activeDiagram={activeDiagram}
        onSaveDiagram={handleSaveDrawIoDiagram}
      />

      {/* Real-time Collaboration Drawer */}
      <CollaborationBar
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        activeRoomId={activeRoomId}
        collaborators={collaborators}
        chatMessages={chatMessages}
        onJoinRoom={(roomId, userName) => setActiveRoomId(roomId)}
        onLeaveRoom={() => {
          setActiveRoomId(null);
          setCollaborators([]);
        }}
        onSendMessage={(text) => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && activeRoomId) {
            wsRef.current.send(JSON.stringify({ type: 'chat_message', text }));
          }
        }}
        themeMode={themeMode}
      />

      {/* Cloud Deployment & Archival Hub Modal */}
      <ExportDeployModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectName={projectName}
        files={files}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onInsertGeneratedHtml={handleInsertComponentHtml}
        aiEnabled={aiEnabled}
      />

      {/* New Project Starter Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateNewProject}
      />

      {/* Keyboard Shortcuts Helper Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        themeMode={themeMode}
      />

      {/* Hosted Webpage Live Production Preview Modal */}
      <HostedPreviewModal
        isOpen={isHostedPreviewOpen}
        onClose={() => setIsHostedPreviewOpen(false)}
        htmlContent={activeHtmlFile?.content || ''}
        cssContent={activeCssFile?.content || ''}
        jsContent={activeJsFile?.content || ''}
        themeMode={themeMode}
      />

      {/* Directly Import Webpage by URL Modal */}
      <ImportUrlModal
        isOpen={isImportUrlOpen}
        onClose={() => setIsImportUrlOpen(false)}
        onImportWebpage={handleImportWebpage}
        themeMode={themeMode}
      />

      {/* Included Media Directory Modal */}
      <MediaListModal
        isOpen={isMediaOpen}
        onClose={() => setIsMediaOpen(false)}
        files={files}
        activeFileId={activeFileId}
        onUpdateFiles={setFiles}
        onInsertMediaHtml={handleInsertComponentHtml}
        themeMode={themeMode}
      />

      {/* Quick Link & Anchor Creator Modal */}
      <QuickLinkModal
        isOpen={isQuickLinkOpen}
        onClose={() => setIsQuickLinkOpen(false)}
        files={files}
        activeFileId={activeFileId}
        onInsertLinkHtml={handleInsertComponentHtml}
        themeMode={themeMode}
      />

      {/* SEO & Head Tags Manager Modal */}
      <HeadTagsSEOModal
        isOpen={isSEOOpen}
        onClose={() => setIsSEOOpen(false)}
        htmlContent={activeHtmlFile?.content || ''}
        onUpdateHtml={(newHtml) => {
          if (activeHtmlFile) {
            handleFileContentChange(activeHtmlFile.id, newHtml);
          }
        }}
        activeFileName={activeHtmlFile?.name || 'index.html'}
        themeMode={themeMode}
      />

      {/* Icon Picker & Vector Graphics Studio Modal */}
      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onInsertIcon={handleInsertComponentHtml}
        themeMode={themeMode}
      />

      {/* SQL Database Studio Modal */}
      <SqlDatabaseExplorerModal
        isOpen={isSqlDbOpen}
        onClose={() => setIsSqlDbOpen(false)}
        isDark={themeMode === 'dark'}
        onExportSqlToProject={(filename, sqlContent) => {
          handleAddNewFile(filename, 'xml', sqlContent);
        }}
      />
    </div>
  );
}
