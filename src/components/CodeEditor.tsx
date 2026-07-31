import React, { useState } from 'react';
import { ProjectFile, ThemeMode } from '../types';
import { 
  FileCode, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  Wand2, 
  Search, 
  FileCheck
} from 'lucide-react';

interface CodeEditorProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onFileContentChange: (fileId: string, newContent: string) => void;
  onAddNewFile: (name: string, type: 'html' | 'css' | 'js') => void;
  onDeleteFile: (fileId: string) => void;
  themeMode?: ThemeMode;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onFileContentChange,
  onAddNewFile,
  onDeleteFile,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const name = newFileName.endsWith(`.${newFileType}`) ? newFileName : `${newFileName}.${newFileType}`;
    onAddNewFile(name, newFileType);
    setNewFileName('');
    setShowNewFileModal(false);
  };

  const lineCount = activeFile?.content ? activeFile.content.split('\n').length : 1;

  return (
    <div className={`flex-1 flex flex-col h-full font-mono text-xs select-none border-r transition-colors ${
      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* File Tab Bar */}
      <div className={`border-b flex items-center justify-between px-2 overflow-x-auto ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-1 py-1">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-t-lg font-medium text-xs cursor-pointer border-t-2 transition-all ${
                file.id === activeFileId
                  ? isDark 
                    ? 'bg-slate-950 text-indigo-400 border-indigo-500 shadow'
                    : 'bg-slate-50 text-indigo-600 border-indigo-500 shadow-sm'
                  : isDark
                    ? 'bg-slate-900 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800'
                    : 'bg-white text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 ${
                file.type === 'html' ? 'text-amber-400' : file.type === 'css' ? 'text-cyan-400' : 'text-yellow-400'
              }`} />
              <span>{file.name}</span>
              {!file.isMain && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFile(file.id);
                  }}
                  className={`hover:text-red-400 ml-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => setShowNewFileModal(true)}
            className={`p-1.5 rounded transition-colors ml-1 ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Create New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2 py-1">
          <button
            onClick={handleCopyCode}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-[11px] transition-colors ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Code Editor Body */}
      {activeFile ? (
        <div className={`flex-1 flex relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
          {/* Line Numbers Column */}
          <div className={`w-12 py-3 border-r text-right pr-3 select-none overflow-hidden font-mono text-[11px] ${
            isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="h-5 leading-5">{i + 1}</div>
            ))}
          </div>

          {/* Raw Code Textarea */}
          <textarea
            value={activeFile.content}
            onChange={(e) => onFileContentChange(activeFile.id, e.target.value)}
            spellCheck={false}
            className={`flex-1 p-3 bg-transparent font-mono text-xs leading-5 resize-none outline-none focus:outline-none focus:ring-0 border-none whitespace-pre overflow-auto ${
              isDark ? 'text-slate-200 scrollbar-thumb-slate-800' : 'text-slate-800 scrollbar-thumb-slate-300'
            }`}
          />
        </div>
      ) : (
        <div className={`flex-1 flex items-center justify-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Select or create a file to start editing.
        </div>
      )}

      {/* Modal for creating a new file */}
      {showNewFileModal && (
        <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${
          isDark ? 'bg-slate-950/80' : 'bg-slate-900/40'
        }`}>
          <div className={`border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-500" />
              <span>Create New Project File</span>
            </h3>

            <form onSubmit={handleCreateFile} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. components.html, custom.css, utils.js"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  File Type
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="html">HTML Document (.html)</option>
                  <option value="css">CSS Stylesheet (.css)</option>
                  <option value="js">JavaScript (.js)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFileModal(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
