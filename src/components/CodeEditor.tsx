import React, { useState, useRef, useMemo } from 'react';
import { ProjectFile, ThemeMode, FileType } from '../types';
import { 
  FileCode, 
  Plus, 
  Check, 
  Copy, 
  Play, 
  Terminal, 
  X,
  Sparkles,
  Zap,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  Filter,
  Info
} from 'lucide-react';
import { runGroovyScript, GroovyExecutionResult } from '../utils/groovyEngine';
import { transpileTypeScript } from '../utils/tsTranspiler';
import { highlightCodeToHTML } from '../utils/syntaxHighlighter';
import { lintCss, applyCssQuickFix, CssLintIssue } from '../utils/cssLinter';
import { lintHtml, applyHtmlQuickFix, HtmlLintIssue } from '../utils/htmlLinter';
import { lintJs, applyJsQuickFix, JsLintIssue } from '../utils/jsLinter';

export type UnifiedLintIssue = (CssLintIssue | HtmlLintIssue | JsLintIssue) & {
  id: string;
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  suggestion?: string;
  offendingText?: string;
};

interface CodeEditorProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onFileContentChange: (fileId: string, newContent: string) => void;
  onAddNewFile: (name: string, type: FileType) => void;
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
  const [newFileType, setNewFileType] = useState<FileType>('html');
  const [copied, setCopied] = useState(false);

  // Syntax highlighting toggle state
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);

  // Refs for scroll synchronization
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Interactive console drawer state for Groovy & TypeScript
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [groovyOutput, setGroovyOutput] = useState<GroovyExecutionResult | null>(null);
  const [tsTranspiledJs, setTsTranspiledJs] = useState<string | null>(null);
  const [tsError, setTsError] = useState<string | null>(null);

  // CSS Real-time Linting State & Diagnostics Drawer
  const [isLinterOpen, setIsLinterOpen] = useState(false);
  const [linterFilter, setLinterFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [hoveredIssueLine, setHoveredIssueLine] = useState<number | null>(null);

  // Real-time Multi-language Linting Analysis
  const activeLintIssues = useMemo<UnifiedLintIssue[]>(() => {
    if (!activeFile) return [];
    if (activeFile.type === 'css') return lintCss(activeFile.content) as UnifiedLintIssue[];
    if (activeFile.type === 'html') return lintHtml(activeFile.content) as UnifiedLintIssue[];
    if (activeFile.type === 'js' || activeFile.type === 'ts') return lintJs(activeFile.content) as UnifiedLintIssue[];
    return [];
  }, [activeFile?.content, activeFile?.type]);

  const activeErrors = useMemo(() => activeLintIssues.filter(i => i.severity === 'error'), [activeLintIssues]);
  const activeWarnings = useMemo(() => activeLintIssues.filter(i => i.severity === 'warning'), [activeLintIssues]);
  const activeInfo = useMemo(() => activeLintIssues.filter(i => i.severity === 'info'), [activeLintIssues]);

  const filteredLintIssues = useMemo(() => {
    if (linterFilter === 'error') return activeErrors;
    if (linterFilter === 'warning') return activeWarnings;
    if (linterFilter === 'info') return activeInfo;
    return activeLintIssues;
  }, [activeLintIssues, activeErrors, activeWarnings, activeInfo, linterFilter]);

  // Map issues by line number for quick gutter lookup
  const issuesByLine = useMemo(() => {
    const map = new Map<number, UnifiedLintIssue[]>();
    for (const issue of activeLintIssues) {
      const existing = map.get(issue.line) || [];
      existing.push(issue);
      map.set(issue.line, existing);
    }
    return map;
  }, [activeLintIssues]);

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

  const handleRunGroovy = () => {
    if (!activeFile || activeFile.type !== 'groovy') return;
    const res = runGroovyScript(activeFile.content);
    setGroovyOutput(res);
    setIsConsoleOpen(true);
    setIsLinterOpen(false);
  };

  const handleTranspileTs = () => {
    if (!activeFile || activeFile.type !== 'ts') return;
    const res = transpileTypeScript(activeFile.content);
    setTsTranspiledJs(res.code);
    setTsError(res.error || null);
    setIsConsoleOpen(true);
    setIsLinterOpen(false);
  };

  const handleFixIssue = (issue: UnifiedLintIssue) => {
    if (!activeFile) return;
    let updatedContent = activeFile.content;

    if (activeFile.type === 'css') {
      updatedContent = applyCssQuickFix(activeFile.content, issue as CssLintIssue);
    } else if (activeFile.type === 'html') {
      updatedContent = applyHtmlQuickFix(activeFile.content, issue as HtmlLintIssue);
    } else if (activeFile.type === 'js' || activeFile.type === 'ts') {
      updatedContent = applyJsQuickFix(activeFile.content, issue as JsLintIssue);
    }

    onFileContentChange(activeFile.id, updatedContent);
  };

  const handleFixAllIssues = () => {
    if (!activeFile || activeLintIssues.length === 0) return;
    let currentContent = activeFile.content;

    for (const issue of activeLintIssues) {
      if (activeFile.type === 'css') {
        currentContent = applyCssQuickFix(currentContent, issue as CssLintIssue);
      } else if (activeFile.type === 'html') {
        currentContent = applyHtmlQuickFix(currentContent, issue as HtmlLintIssue);
      } else if (activeFile.type === 'js' || activeFile.type === 'ts') {
        currentContent = applyJsQuickFix(currentContent, issue as JsLintIssue);
      }
    }
    onFileContentChange(activeFile.id, currentContent);
  };

  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const lineCount = activeFile?.content ? activeFile.content.split('\n').length : 1;

  const highlightedHtml = useMemo(() => {
    if (!activeFile || !syntaxHighlighting) return '';
    return highlightCodeToHTML(activeFile.content, activeFile.type, isDark);
  }, [activeFile?.content, activeFile?.type, syntaxHighlighting, isDark]);

  const getFileIconColor = (type: FileType) => {
    switch (type) {
      case 'html': return 'text-amber-400';
      case 'css': return 'text-cyan-400';
      case 'js': return 'text-yellow-400';
      case 'ts': return 'text-sky-400';
      case 'groovy': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

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
              <FileCode className={`w-3.5 h-3.5 ${getFileIconColor(file.type)}`} />
              <span>{file.name}</span>
              {file.type === 'html' && (
                <span className="text-[9px] px-1 bg-amber-500/20 text-amber-400 rounded font-bold">HTML</span>
              )}
              {file.type === 'css' && (
                <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-400 rounded font-bold">CSS</span>
              )}
              {(file.type === 'js' || file.type === 'ts') && (
                <span className="text-[9px] px-1 bg-yellow-500/20 text-yellow-400 rounded font-bold">
                  {file.type.toUpperCase()}
                </span>
              )}
              {file.type === 'groovy' && (
                <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-400 rounded font-bold">Groovy</span>
              )}
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
            title="Create New Project File (.html, .css, .js, .ts, .groovy)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2 py-1">
          {/* Real-time Multi-language Linter Indicator Toggle */}
          {['html', 'css', 'js', 'ts'].includes(activeFile?.type || '') && (
            <button
              onClick={() => {
                setIsLinterOpen(!isLinterOpen);
                if (isConsoleOpen) setIsConsoleOpen(false);
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                activeErrors.length > 0
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-sm animate-pulse'
                  : activeWarnings.length > 0
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-sm'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
              title={`Toggle Real-time ${activeFile?.type.toUpperCase()} Linter Diagnostics`}
            >
              {activeErrors.length > 0 ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ) : activeWarnings.length > 0 ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>
                {activeFile?.type.toUpperCase()} Linter: {activeLintIssues.length === 0 ? 'Clean' : `${activeErrors.length} Err, ${activeWarnings.length} Warn`}
              </span>
            </button>
          )}

          {/* Syntax Highlighting Toggle */}
          <button
            onClick={() => setSyntaxHighlighting(!syntaxHighlighting)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              syntaxHighlighting
                ? isDark
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                : isDark
                  ? 'bg-slate-900 text-slate-400 border border-slate-800'
                  : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}
            title="Toggle Code Syntax Highlighting ON / OFF"
          >
            <Sparkles className={`w-3.5 h-3.5 ${syntaxHighlighting ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span>Syntax {syntaxHighlighting ? 'ON' : 'OFF'}</span>
          </button>

          {activeFile?.type === 'groovy' && (
            <button
              onClick={handleRunGroovy}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all"
              title="Execute GroovyScript code"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run GroovyScript</span>
            </button>
          )}

          {activeFile?.type === 'ts' && (
            <button
              onClick={handleTranspileTs}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] shadow-sm transition-all"
              title="Transpile TypeScript to JavaScript"
            >
              <Zap className="w-3 h-3" />
              <span>Transpile TS</span>
            </button>
          )}

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
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className={`flex-1 flex relative overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
            {/* Line Numbers Column with CSS Lint Indicators */}
            <div className={`w-14 py-3 border-r text-right pr-2 select-none overflow-hidden font-mono text-[11px] relative ${
              isDark ? 'bg-slate-900/60 border-slate-800/80 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {Array.from({ length: lineCount }).map((_, i) => {
                const lineNum = i + 1;
                const lineIssues = ['html', 'css', 'js', 'ts'].includes(activeFile.type) ? issuesByLine.get(lineNum) : undefined;
                const hasError = lineIssues?.some(iss => iss.severity === 'error');
                const hasWarning = lineIssues?.some(iss => iss.severity === 'warning');

                return (
                  <div 
                    key={i} 
                    className="h-5 leading-5 flex items-center justify-end space-x-1 group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIssueLine(lineNum)}
                    onMouseLeave={() => setHoveredIssueLine(null)}
                    onClick={() => {
                      if (lineIssues && lineIssues.length > 0) {
                        setIsLinterOpen(true);
                      }
                    }}
                  >
                    {/* Gutter Lint Status Marker */}
                    {lineIssues && lineIssues.length > 0 && (
                      <span className="mr-0.5">
                        {hasError ? (
                          <AlertCircle className="w-3 h-3 text-rose-500 animate-pulse inline-block" />
                        ) : hasWarning ? (
                          <AlertTriangle className="w-3 h-3 text-amber-400 inline-block" />
                        ) : (
                          <Info className="w-3 h-3 text-sky-400 inline-block" />
                        )}
                      </span>
                    )}

                    <span className={`font-mono ${
                      hasError 
                        ? 'text-rose-400 font-bold' 
                        : hasWarning 
                          ? 'text-amber-400 font-semibold' 
                          : ''
                    }`}>
                      {lineNum}
                    </span>

                    {/* Floating Hover Tooltip for Line Issues */}
                    {hoveredIssueLine === lineNum && lineIssues && lineIssues.length > 0 && (
                      <div className="absolute left-14 top-0 z-50 w-80 p-2.5 rounded-lg bg-slate-900 text-slate-100 shadow-xl border border-slate-700 text-left pointer-events-auto select-text font-sans text-xs space-y-1.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1 font-mono text-[10px] text-slate-400">
                          <span>Line {lineNum} {activeFile.type.toUpperCase()} Diagnostic</span>
                          <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-slate-800">
                            {lineIssues[0].rule}
                          </span>
                        </div>
                        {lineIssues.map((issue) => (
                          <div key={issue.id} className="space-y-1">
                            <p className="text-xs leading-snug font-medium text-slate-200">
                              {issue.message}
                            </p>
                            {issue.suggestion && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFixIssue(issue);
                                }}
                                className="flex items-center space-x-1 px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] rounded font-mono transition-colors"
                              >
                                <Wrench className="w-3 h-3" />
                                <span>Apply Fix: {issue.suggestion}</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Editor Canvas Area with Overlay */}
            <div className="flex-1 relative overflow-hidden">
              {/* Highlighted Code Overlay */}
              {syntaxHighlighting && (
                <div
                  ref={overlayRef}
                  className="absolute inset-0 p-3 font-mono text-xs leading-5 whitespace-pre overflow-hidden pointer-events-none select-none z-0"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
              )}

              {/* Editable Textarea */}
              <textarea
                ref={textareaRef}
                value={activeFile.content}
                onChange={(e) => onFileContentChange(activeFile.id, e.target.value)}
                onScroll={handleScroll}
                spellCheck={false}
                className={`absolute inset-0 p-3 bg-transparent font-mono text-xs leading-5 resize-none outline-none focus:outline-none focus:ring-0 border-none whitespace-pre overflow-auto z-10 ${
                  syntaxHighlighting
                    ? isDark
                      ? 'text-transparent caret-indigo-400 selection:bg-indigo-500/30'
                      : 'text-transparent caret-indigo-600 selection:bg-indigo-200/60'
                    : isDark
                      ? 'text-slate-200 caret-indigo-400 scrollbar-thumb-slate-800'
                      : 'text-slate-800 caret-indigo-600 scrollbar-thumb-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Real-Time Multi-Language Diagnostics / Linter Drawer */}
          {['html', 'css', 'js', 'ts'].includes(activeFile?.type || '') && isLinterOpen && (
            <div className={`border-t h-56 flex flex-col shadow-2xl transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-900 border-slate-700 text-slate-100'
            }`}>
              {/* Drawer Top Header Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center space-x-3">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs tracking-wider uppercase text-slate-200">
                    {activeFile?.type.toUpperCase()} Real-Time Linting Diagnostics
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-cyan-300 rounded-full font-mono">
                    {activeLintIssues.length} total issue{activeLintIssues.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Filter Tabs & Quick Fix Actions */}
                <div className="flex items-center space-x-2">
                  {activeLintIssues.length > 0 && (
                    <button
                      onClick={handleFixAllIssues}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold shadow-sm transition-all"
                      title="Automatically fix detected code errors and syntax issues"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>Auto-Fix All Issues</span>
                    </button>
                  )}

                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 space-x-1">
                    <button
                      onClick={() => setLinterFilter('all')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        linterFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      All ({activeLintIssues.length})
                    </button>
                    <button
                      onClick={() => setLinterFilter('error')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        linterFilter === 'error' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Errors ({activeErrors.length})
                    </button>
                    <button
                      onClick={() => setLinterFilter('warning')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        linterFilter === 'warning' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Warnings ({activeWarnings.length})
                    </button>
                  </div>

                  <button
                    onClick={() => setIsLinterOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Linter Issues List */}
              <div className="flex-1 p-3 font-mono text-xs overflow-auto space-y-2 bg-slate-950">
                {filteredLintIssues.length > 0 ? (
                  filteredLintIssues.map((issue) => (
                    <div 
                      key={issue.id}
                      className={`flex items-start justify-between p-2.5 rounded-lg border transition-all ${
                        issue.severity === 'error'
                          ? 'bg-rose-950/30 border-rose-900/50 text-rose-200'
                          : issue.severity === 'warning'
                            ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                            : 'bg-sky-950/30 border-sky-900/50 text-sky-200'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5 flex-1 pr-3">
                        <div className="mt-0.5">
                          {issue.severity === 'error' ? (
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          ) : issue.severity === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-sky-400 shrink-0" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              Line {issue.line}{issue.column ? `:${issue.column}` : ''}
                            </span>
                            <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
                              [{issue.rule}]
                            </span>
                          </div>
                          <p className="text-xs font-sans text-slate-200">
                            {issue.message}
                          </p>
                        </div>
                      </div>

                      {/* Quick Fix Button if Fix Available */}
                      {(issue.suggestion || issue.rule) && (
                        <button
                          onClick={() => handleFixIssue(issue)}
                          className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold rounded shadow-sm transition-all shrink-0"
                          title="Auto-apply quick fix for this issue"
                        >
                          <Wrench className="w-3 h-3" />
                          <span>Quick Fix</span>
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-6 text-slate-500 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/80" />
                    <p className="text-xs text-slate-400 font-sans">
                      No {activeFile?.type.toUpperCase()} syntax errors or issues detected!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Groovy / TypeScript Output Drawer */}
          {isConsoleOpen && (
            <div className={`border-t h-48 flex flex-col shadow-2xl transition-all ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-900 border-slate-700 text-slate-100'
            }`}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs tracking-wider uppercase text-slate-200">
                    {activeFile.type === 'groovy' ? 'GroovyScript Execution Console' : 'TypeScript Transpiled Output'}
                  </span>
                  {groovyOutput?.executionTimeMs !== undefined && activeFile.type === 'groovy' && (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 rounded-full font-mono">
                      ⚡ {groovyOutput.executionTimeMs} ms
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsConsoleOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-4 font-mono text-xs overflow-auto space-y-2 select-text bg-slate-950">
                {activeFile.type === 'groovy' && groovyOutput && (
                  <div>
                    {groovyOutput.error ? (
                      <div className="text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/50">
                        <span className="font-bold">Execution Error:</span> {groovyOutput.error}
                      </div>
                    ) : null}

                    {groovyOutput.output.length > 0 ? (
                      <div className="space-y-1">
                        <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Console Logs (println):</div>
                        {groovyOutput.output.map((line, idx) => (
                          <div key={idx} className="text-emerald-300 bg-slate-900/80 px-3 py-1 rounded border border-slate-800/60 font-mono">
                            {line}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-500 italic">Script executed with no output. Use <code className="text-emerald-400">println("...")</code> to view logs.</div>
                    )}

                    {groovyOutput.result !== undefined && (
                      <div className="mt-2 text-indigo-300 text-[11px]">
                        Return value: <code className="text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">{JSON.stringify(groovyOutput.result)}</code>
                      </div>
                    )}
                  </div>
                )}

                {activeFile.type === 'ts' && (
                  <div>
                    {tsError && (
                      <div className="text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900/50 mb-2">
                        <span className="font-bold">Transpilation Notice:</span> {tsError}
                      </div>
                    )}
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Standard JavaScript Output:</div>
                    <pre className="text-sky-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 font-mono whitespace-pre overflow-x-auto text-xs">
                      {tsTranspiledJs || '// Transpiled JS will appear here'}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
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
                  placeholder="e.g. main.ts, script.groovy, app.js"
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
                  onChange={(e) => setNewFileType(e.target.value as FileType)}
                  className={`w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="html">HTML Document (.html)</option>
                  <option value="css">CSS Stylesheet (.css)</option>
                  <option value="js">JavaScript (.js)</option>
                  <option value="ts">TypeScript (.ts)</option>
                  <option value="groovy">GroovyScript (.groovy)</option>
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

