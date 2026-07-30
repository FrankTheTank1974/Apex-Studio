/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ProjectFile, 
  ViewMode, 
  DeviceMode, 
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
import { downloadTarZstd } from './utils/tarZstd';

export default function App() {
  const [projectName, setProjectName] = useState('ApexStudio Project');
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('index-html');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [selectedElement, setSelectedElement] = useState<SelectedElementInfo | null>(null);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDrawIoOpen, setIsDrawIoOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  // Active Draw.io diagram state
  const [activeDiagram, setActiveDiagram] = useState<DrawIoDiagram | null>(null);

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
  const handleUpdateHtml = (newHtml: string) => {
    const updated = files.map((f) => (f.type === 'html' ? { ...f, content: newHtml } : f));
    broadcastFileUpdate(updated);
  };

  // Update File content from Code Editor
  const handleFileContentChange = (fileId: string, newContent: string) => {
    const updated = files.map((f) => (f.id === fileId ? { ...f, content: newContent } : f));
    broadcastFileUpdate(updated);
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

    const updatedDocHtml = doc.documentElement.outerHTML;
    handleUpdateHtml(`<!DOCTYPE html>\n${updatedDocHtml}`);
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
      handleUpdateHtml(`<!DOCTYPE html>\n${doc.documentElement.outerHTML}`);
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
      handleUpdateHtml(`<!DOCTYPE html>\n${doc.documentElement.outerHTML}`);
    }
  };

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
      handleUpdateHtml(`<!DOCTYPE html>\n${doc.documentElement.outerHTML}`);
    }
  };

  // Handle Save Draw.io Diagram
  const handleSaveDrawIoDiagram = (diagram: DrawIoDiagram) => {
    setActiveDiagram(diagram);

    // Insert or update Draw.io diagram HTML in canvas
    const diagramHtml = `<div class="my-8 p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 text-center shadow-lg drawio-container" data-diagram-id="${diagram.id}">
  <div class="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
    <div class="flex items-center space-x-2">
      <span class="text-amber-400 font-bold">❖</span>
      <span class="font-bold text-sm tracking-wide">${diagram.title}</span>
    </div>
    <span class="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">Draw.io Vector</span>
  </div>
  <div class="diagram-viewport p-4 bg-slate-950 rounded-xl flex items-center justify-center">
    ${diagram.svg || `<div className="text-amber-400 font-bold p-8">Diagram SVG updated</div>`}
  </div>
</div>`;

    handleInsertComponentHtml(diagramHtml);
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
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Navbar */}
      <Navbar
        projectName={projectName}
        onProjectNameChange={setProjectName}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenDrawIo={() => setIsDrawIoOpen(true)}
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
              onOpenDrawIoWithDiagram={() => setIsDrawIoOpen(true)}
              collaboratorCursors={remoteCursors}
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
          />
        )}
      </div>

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
    </div>
  );
}
