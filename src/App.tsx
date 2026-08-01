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
  DrawIoDiagram 
} from './types';
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
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isFontsOpen, setIsFontsOpen] = useState(false);

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

  const activeHtmlFile = files.find((f) => f.type === 'html') || files[0];
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

    const updated = files.map((f) => (f.type === 'html' ? { ...f, content: newHtml } : f));
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

  // Keyboard shortcut listener for Delete/Backspace key and Ctrl+Z / Cmd+Z Undo/Redo
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
  const handleAddNewFile = (name: string, type: 'html' | 'css' | 'js') => {
    const newFile: ProjectFile = {
      id: 'file-' + Date.now(),
      name,
      type,
      path: `/${name}`,
      content: type === 'html' ? '<div>Custom Page Content</div>' : type === 'css' ? '/* Custom CSS */' : '// Custom JS',
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
        onOpenDrawIo={() => setIsDrawIoOpen(true)}
        onOpenFonts={() => setIsFontsOpen(true)}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onExportZst={handleExportZstArchive}
        activeRoomId={activeRoomId}
        onToggleCollab={() => setIsCollabOpen(!isCollabOpen)}
        collaboratorCount={collaborators.length}
      />

      {/* Main Studio Workbench Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Component Drag & Drop Palette (WYSIWYG or Split mode) */}
        {(viewMode === 'wysiwyg' || viewMode === 'split') && (
          <ComponentLibrary
            onInsertComponent={handleInsertComponentHtml}
            themeMode={themeMode}
          />
        )}

        {/* Center Canvas / Code Split Views */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* WYSIWYG Visual View (Visible in WYSIWYG, Split, Preview) */}
          {viewMode !== 'code' && (
            <WYSIWYGCanvas
              htmlContent={activeHtmlFile?.content || ''}
              cssContent={activeCssFile?.content || ''}
              jsContent={activeJsFile?.content || ''}
              deviceMode={viewMode === 'preview' ? 'desktop' : deviceMode}
              onSelectElement={setSelectedElement}
              onUpdateHtmlFromCanvas={handleUpdateHtml}
              onDeleteSelectedElement={handleDeleteElement}
              onOpenDrawIoWithDiagram={handleOpenDrawIoWithDiagram}
              collaboratorCursors={remoteCursors}
              themeMode={themeMode}
            />
          )}

          {/* Code Editors View (Visible in Code or Split mode) */}
          {(viewMode === 'code' || viewMode === 'split') && (
            <CodeEditor
              files={files}
              activeFileId={activeFileId}
              onSelectFile={setActiveFileId}
              onFileContentChange={handleFileContentChange}
              onAddNewFile={handleAddNewFile}
              onDeleteFile={handleDeleteFile}
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
      />

      {/* New Project Starter Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateNewProject}
      />
    </div>
  );
}
