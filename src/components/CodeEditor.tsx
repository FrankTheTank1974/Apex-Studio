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
  Info,
  AlignLeft,
  Code,
  Tag,
  ChevronRight,
  FileJson,
  Layers,
  FileCheck,
  FolderTree,
  Database,
  Globe,
  Shield,
  Bot,
  DollarSign,
  ChevronDown,
  FileText
} from 'lucide-react';
import { WEB_POLICY_PRESETS, getWebPolicyDefaultContent } from '../data/webPolicyTemplates';
import { runGroovyScript, GroovyExecutionResult } from '../utils/groovyEngine';
import { transpileTypeScript } from '../utils/tsTranspiler';
import { highlightCodeToHTML } from '../utils/syntaxHighlighter';
import { lintCss, applyCssQuickFix, CssLintIssue } from '../utils/cssLinter';
import { lintHtml, applyHtmlQuickFix, repairHtmlWithDOMParser, HtmlLintIssue } from '../utils/htmlLinter';
import { lintJs, applyJsQuickFix, JsLintIssue } from '../utils/jsLinter';
import { lintGroovy, applyGroovyQuickFix, GroovyLintIssue } from '../utils/groovyLinter';
import { lintXml, applyXmlQuickFix, XmlLintIssue } from '../utils/xmlLinter';
import { formatXml } from '../utils/xmlFormatter';
import { convertXmlToJson } from '../utils/xmlToJson';
import { validateXmlAgainstXsd, XsdValidationResult } from '../utils/xsdValidator';
import { XsdValidationModal } from './XsdValidationModal';
import { XmlStructureExplorer } from './XmlStructureExplorer';
import { A11yAuditorPanel } from './A11yAuditorPanel';
import { auditHtmlAccessibility } from '../utils/a11yAuditor';
import { 
  getXmlCompletionsAtCursor, 
  extractDocumentXmlTags, 
  getOpenParentTagsAtCursor,
  getXmlBreadcrumbsAtCursor,
  XmlTagSuggestion,
  XmlBreadcrumbNode
} from '../utils/xmlAutoCompleter';

export type UnifiedLintIssue = (CssLintIssue | HtmlLintIssue | JsLintIssue | GroovyLintIssue | XmlLintIssue) & {
  id: string;
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  suggestion?: string;
  offendingText?: string;
  expectedText?: string;
};

interface CodeEditorProps {
  files: ProjectFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onFileContentChange: (fileId: string, newContent: string) => void;
  onAddNewFile: (name: string, type: FileType, initialContent?: string) => void;
  onDeleteFile: (fileId: string) => void;
  onOpenSqlDb?: () => void;
  themeMode?: ThemeMode;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFileId,
  onSelectFile,
  onFileContentChange,
  onAddNewFile,
  onDeleteFile,
  onOpenSqlDb,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  // Conditionally hide config.xml if no other XML file exists in the project
  const hasUserXmlFiles = useMemo(() => {
    return files.some((f) => f.type === 'xml' && f.name.toLowerCase() !== 'config.xml');
  }, [files]);

  const visibleFiles = useMemo(() => {
    return files.filter((f) => {
      if (f.name.toLowerCase() === 'config.xml' && !hasUserXmlFiles) {
        return false;
      }
      return true;
    });
  }, [files, hasUserXmlFiles]);

  const activeFile = visibleFiles.find((f) => f.id === activeFileId) || visibleFiles[0] || files[0];
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<FileType>('html');
  const [isWebPolicyMenuOpen, setIsWebPolicyMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [xmlFormattedSuccess, setXmlFormattedSuccess] = useState(false);
  const [htmlFixedSuccess, setHtmlFixedSuccess] = useState(false);
  const [xmlToJsonStatus, setXmlToJsonStatus] = useState<{ text: string; isError: boolean } | null>(null);

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

  // Accessibility Auditor Drawer State
  const [isA11yAuditorOpen, setIsA11yAuditorOpen] = useState(false);

  // Compute Accessibility Audit Report for active HTML file
  const a11yReport = useMemo(() => {
    if (activeFile && activeFile.type === 'html') {
      return auditHtmlAccessibility(activeFile.content);
    }
    return null;
  }, [activeFile?.content, activeFile?.type]);

  // XSD Validation Engine State
  const [isXsdModalOpen, setIsXsdModalOpen] = useState<boolean>(false);
  const [xsdSchemaText, setXsdSchemaText] = useState<string>(`<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root" type="xs:string"/>
</xs:schema>`);
  const [isXsdLiveValidationEnabled, setIsXsdLiveValidationEnabled] = useState<boolean>(true);

  // XML Structure Explorer Tree Side Panel State
  const [isXmlTreeOpen, setIsXmlTreeOpen] = useState<boolean>(false);

  // Compute XSD validation result for active XML file
  const xsdValidationResult = useMemo<XsdValidationResult | null>(() => {
    if (!activeFile || activeFile.type !== 'xml' || !xsdSchemaText || !xsdSchemaText.trim()) {
      return null;
    }
    return validateXmlAgainstXsd(activeFile.content, xsdSchemaText);
  }, [activeFile?.content, activeFile?.type, xsdSchemaText]);

  // Real-time Multi-language Linting Analysis
  const activeLintIssues = useMemo<UnifiedLintIssue[]>(() => {
    if (!activeFile) return [];
    if (activeFile.type === 'css') return lintCss(activeFile.content) as UnifiedLintIssue[];
    if (activeFile.type === 'html') return lintHtml(activeFile.content) as UnifiedLintIssue[];
    if (activeFile.type === 'js' || activeFile.type === 'ts') return lintJs(activeFile.content) as UnifiedLintIssue[];
    if (activeFile.type === 'groovy') return lintGroovy(activeFile.content) as UnifiedLintIssue[];
    if (activeFile.type === 'xml') {
      const xmlIssues = lintXml(activeFile.content) as UnifiedLintIssue[];
      if (isXsdLiveValidationEnabled && xsdValidationResult && !xsdValidationResult.valid) {
        const xsdIssues: UnifiedLintIssue[] = xsdValidationResult.errors.map((err) => ({
          id: err.id,
          line: err.line,
          column: err.column,
          message: err.message,
          severity: err.severity,
          rule: err.rule as any,
          offendingText: err.offendingText,
          tagName: err.elementName,
          expectedText: err.expectedText,
          suggestion: err.suggestion
        }));
        return [...xmlIssues, ...xsdIssues];
      }
      return xmlIssues;
    }
    return [];
  }, [activeFile?.content, activeFile?.type, isXsdLiveValidationEnabled, xsdValidationResult]);

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

  // XML Tag Auto-Completion & Structure Inspection State
  const [xmlCursorPos, setXmlCursorPos] = useState<number>(0);
  const [isXmlAutoCompleteOpen, setIsXmlAutoCompleteOpen] = useState<boolean>(false);
  const [selectedXmlSuggestionIndex, setSelectedXmlSuggestionIndex] = useState<number>(0);

  // Extract all XML tag names across project XML files for cross-file completion context
  const otherXmlContents = useMemo(() => {
    return files.filter(f => f.type === 'xml' && f.id !== activeFile?.id).map(f => f.content);
  }, [files, activeFile?.id]);

  // Active XML completions at cursor position
  const xmlCompletionsData = useMemo(() => {
    if (!activeFile || activeFile.type !== 'xml') {
      return { query: '', prefixStart: 0, suggestions: [] as XmlTagSuggestion[] };
    }
    return getXmlCompletionsAtCursor(activeFile.content, xmlCursorPos, otherXmlContents);
  }, [activeFile?.content, activeFile?.type, xmlCursorPos, otherXmlContents]);

  // Unique XML tag names discovered in current document & project
  const documentXmlTags = useMemo(() => {
    if (!activeFile || activeFile.type !== 'xml') return [];
    const set = new Set<string>(extractDocumentXmlTags(activeFile.content));
    otherXmlContents.forEach(c => extractDocumentXmlTags(c).forEach(t => set.add(t)));
    return Array.from(set);
  }, [activeFile?.content, activeFile?.type, otherXmlContents]);

  // Currently open parent tags at caret
  const openParentXmlTags = useMemo(() => {
    if (!activeFile || activeFile.type !== 'xml') return [];
    return getOpenParentTagsAtCursor(activeFile.content, xmlCursorPos);
  }, [activeFile?.content, activeFile?.type, xmlCursorPos]);

  // Hierarchical XML breadcrumb nodes at cursor position
  const xmlBreadcrumbs = useMemo(() => {
    if (!activeFile || activeFile.type !== 'xml') return [];
    return getXmlBreadcrumbsAtCursor(activeFile.content, xmlCursorPos);
  }, [activeFile?.content, activeFile?.type, xmlCursorPos]);

  const handleJumpToXmlTag = (startOffset: number) => {
    setXmlCursorPos(startOffset);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(startOffset, startOffset);
    }
  };

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

  const handleFixHtmlErrors = () => {
    if (!activeFile || activeFile.type !== 'html') return;
    const repaired = repairHtmlWithDOMParser(activeFile.content);
    onFileContentChange(activeFile.id, repaired);
    setHtmlFixedSuccess(true);
    setTimeout(() => setHtmlFixedSuccess(false), 2000);
  };

  const handleTranspileTs = () => {
    if (!activeFile || activeFile.type !== 'ts') return;
    const res = transpileTypeScript(activeFile.content);
    setTsTranspiledJs(res.code);
    setTsError(res.error || null);
    setIsConsoleOpen(true);
    setIsLinterOpen(false);
  };

  const handleFormatXml = () => {
    if (!activeFile || activeFile.type !== 'xml') return;
    const formatted = formatXml(activeFile.content, 2);
    onFileContentChange(activeFile.id, formatted);
    setXmlFormattedSuccess(true);
    setTimeout(() => setXmlFormattedSuccess(false), 2000);
  };

  const handleConvertXmlToJson = () => {
    if (!activeFile || activeFile.type !== 'xml') return;

    const result = convertXmlToJson(activeFile.content);
    if (!result.success || !result.jsonString) {
      setXmlToJsonStatus({ text: result.error || 'Invalid XML content', isError: true });
      setTimeout(() => setXmlToJsonStatus(null), 4000);
      return;
    }

    // Determine unique target JSON filename based on active XML filename
    const baseName = activeFile.name.replace(/\.xml$/i, '');
    let targetFileName = `${baseName}.json`;
    let counter = 1;
    while (files.some(f => f.name.toLowerCase() === targetFileName.toLowerCase())) {
      targetFileName = `${baseName}-${counter}.json`;
      counter++;
    }

    // Export JSON file to project and select it
    onAddNewFile(targetFileName, 'json', result.jsonString);
    setXmlToJsonStatus({ text: `Exported ${targetFileName}`, isError: false });
    setTimeout(() => setXmlToJsonStatus(null), 3500);
  };

  const handleApplyXmlSuggestion = (suggestion: XmlTagSuggestion) => {
    if (!activeFile || activeFile.type !== 'xml') return;

    const { prefixStart } = xmlCompletionsData;
    const currentText = activeFile.content;

    const beforePrefix = currentText.substring(0, prefixStart);
    const afterCursor = currentText.substring(xmlCursorPos);

    const newContent = beforePrefix + suggestion.insertText + afterCursor;

    let newCaretPos = prefixStart + suggestion.insertText.length;
    if (suggestion.cursorOffsetIndex !== undefined) {
      newCaretPos = prefixStart + suggestion.cursorOffsetIndex;
    }

    onFileContentChange(activeFile.id, newContent);
    setIsXmlAutoCompleteOpen(false);
    setXmlCursorPos(newCaretPos);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCaretPos, newCaretPos);
      }
    }, 0);
  };

  const handleInsertXmlTagPill = (tagName: string, mode: 'paired' | 'closing' | 'opening' = 'paired') => {
    if (!activeFile || activeFile.type !== 'xml') return;

    const caret = xmlCursorPos;
    const currentText = activeFile.content;
    const before = currentText.substring(0, caret);
    const after = currentText.substring(caret);

    let insertString = `<${tagName}></${tagName}>`;
    let newCaret = caret + tagName.length + 2;

    if (mode === 'closing') {
      insertString = `</${tagName}>`;
      newCaret = caret + insertString.length;
    } else if (mode === 'opening') {
      insertString = `<${tagName}>`;
      newCaret = caret + insertString.length;
    }

    const updated = before + insertString + after;
    onFileContentChange(activeFile.id, updated);
    setXmlCursorPos(newCaret);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCaret, newCaret);
      }
    }, 0);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (activeFile?.type === 'xml' && isXmlAutoCompleteOpen && xmlCompletionsData.suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedXmlSuggestionIndex(prev => (prev + 1) % xmlCompletionsData.suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedXmlSuggestionIndex(prev => (prev - 1 + xmlCompletionsData.suggestions.length) % xmlCompletionsData.suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const currentSuggestion = xmlCompletionsData.suggestions[selectedXmlSuggestionIndex] || xmlCompletionsData.suggestions[0];
        if (currentSuggestion) {
          handleApplyXmlSuggestion(currentSuggestion);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsXmlAutoCompleteOpen(false);
        return;
      }
    }

    // Ctrl + Space shortcut triggers XML tag autocomplete
    if (activeFile?.type === 'xml' && e.ctrlKey && e.key === ' ') {
      e.preventDefault();
      setIsXmlAutoCompleteOpen(prev => !prev);
      setSelectedXmlSuggestionIndex(0);
    }
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
    } else if (activeFile.type === 'groovy') {
      updatedContent = applyGroovyQuickFix(activeFile.content, issue as GroovyLintIssue);
    } else if (activeFile.type === 'xml') {
      updatedContent = applyXmlQuickFix(activeFile.content, issue as XmlLintIssue);
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
      } else if (activeFile.type === 'groovy') {
        currentContent = applyGroovyQuickFix(currentContent, issue as GroovyLintIssue);
      } else if (activeFile.type === 'xml') {
        currentContent = applyXmlQuickFix(currentContent, issue as XmlLintIssue);
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
      case 'xml': return 'text-orange-400';
      case 'txt': return 'text-purple-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full font-mono text-xs select-none border-r transition-colors ${
      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* File Tab Bar (Row 1) */}
      <div className={`border-b flex items-center px-2 overflow-x-auto whitespace-nowrap custom-scrollbar shrink-0 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-1 py-1">
          {visibleFiles.map((file) => (
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
              {file.type === 'xml' && (
                <span className="text-[9px] px-1 bg-orange-500/20 text-orange-400 rounded font-bold">XML</span>
              )}
              {file.type === 'txt' && (
                <span className="text-[9px] px-1 bg-purple-500/20 text-purple-400 rounded font-bold">TXT</span>
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
            title="Create New Project File (.html, .css, .js, .ts, .groovy, .xml, .txt)"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Web Policy Quick Presets Dropdown */}
          <div className="relative border-l border-slate-700/50 pl-1.5 ml-1.5 flex items-center">
            <button
              onClick={() => setIsWebPolicyMenuOpen(!isWebPolicyMenuOpen)}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-700/50 shadow-sm'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
              }`}
              title="Create or view Web Standard Policy files (robots.txt, security.txt, ads.txt, trust.txt)"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Web Policy Files</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isWebPolicyMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isWebPolicyMenuOpen && (
              <div className={`absolute top-full right-0 mt-1.5 w-64 rounded-xl border shadow-2xl z-50 p-2 space-y-1 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-1">
                  <span>Standard Web Policies</span>
                  <Shield className="w-3 h-3 text-indigo-400" />
                </div>
                {WEB_POLICY_PRESETS.map((preset) => {
                  const exists = files.some((f) => f.name.toLowerCase() === preset.filename.toLowerCase());
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        if (exists) {
                          const f = files.find((item) => item.name.toLowerCase() === preset.filename.toLowerCase());
                          if (f) onSelectFile(f.id);
                        } else {
                          onAddNewFile(preset.filename, 'txt', preset.defaultContent);
                        }
                        setIsWebPolicyMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer ${
                        isDark ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <div>
                          <div className="font-bold font-mono text-[11px] flex items-center space-x-1">
                            <span>{preset.filename}</span>
                            {preset.filename === 'trust.txt' && (
                              <span className="text-[9px] text-slate-400 font-normal">/ Trust.txt</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{preset.category}</div>
                        </div>
                      </div>
                      {exists ? (
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-semibold">
                          Open
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full font-semibold">
                          + Add
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Action Toolbar (Row 2) */}
      <div className={`border-b flex flex-wrap items-center justify-between gap-2 px-3 py-1 text-xs overflow-x-auto whitespace-nowrap custom-scrollbar shrink-0 ${
        isDark ? 'bg-slate-950/90 border-slate-800/80' : 'bg-slate-100/80 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          {/* Real-time Multi-language Linter Indicator Toggle */}
          {['html', 'css', 'js', 'ts', 'groovy', 'xml'].includes(activeFile?.type || '') && (
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
        </div>

        <div className="flex items-center space-x-2">

          {activeFile?.type === 'html' && (
            <>
              <button
                onClick={() => {
                  setIsA11yAuditorOpen(!isA11yAuditorOpen);
                  if (isLinterOpen) setIsLinterOpen(false);
                  if (isConsoleOpen) setIsConsoleOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded font-bold text-[11px] shadow-sm transition-all cursor-pointer ${
                  isA11yAuditorOpen
                    ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md'
                    : a11yReport && a11yReport.issues.length > 0
                    ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60'
                    : 'bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-800/40'
                }`}
                title="Scan current HTML structure for missing ARIA labels, alt text, and color contrast violations"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Accessibility Audit</span>
                {a11yReport && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-extrabold ${
                    a11yReport.score >= 90
                      ? 'bg-emerald-500/30 text-emerald-300'
                      : a11yReport.score >= 70
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'bg-rose-500/30 text-rose-300'
                  }`}>
                    {a11yReport.score}% ({a11yReport.issues.length})
                  </span>
                )}
              </button>

              <button
                onClick={handleFixHtmlErrors}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                title="Programmatically repair malformed HTML elements, unclosed quotes, and missing closing tags using DOMParser"
              >
                {htmlFixedSuccess ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Wrench className="w-3.5 h-3.5 text-white" />
                )}
                <span>{htmlFixedSuccess ? 'HTML Repaired!' : 'Fix Common HTML Errors'}</span>
              </button>
            </>
          )}

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

          {activeFile?.type === 'xml' && (
            <>
              <button
                onClick={() => setIsXmlAutoCompleteOpen(!isXmlAutoCompleteOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                  isXmlAutoCompleteOpen
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : 'bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/60'
                }`}
                title="Toggle XML Tag Auto-Completion Popover (Ctrl+Space)"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Tag Helper ({documentXmlTags.length})</span>
              </button>

              <button
                onClick={handleFormatXml}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                title="Pretty-print and auto-indent XML document"
              >
                {xmlFormattedSuccess ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <AlignLeft className="w-3.5 h-3.5 text-white" />
                )}
                <span>{xmlFormattedSuccess ? 'Formatted!' : 'Format XML'}</span>
              </button>

              <button
                onClick={handleConvertXmlToJson}
                className="flex items-center space-x-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                title="Convert XML markup to structured JSON and export as a new file"
              >
                <FileJson className="w-3.5 h-3.5 text-white" />
                <span>Convert XML to JSON</span>
              </button>

              <button
                onClick={() => setIsXsdModalOpen(true)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                  xsdValidationResult
                    ? xsdValidationResult.valid
                      ? 'bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                      : 'bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-700/60'
                    : 'bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 border border-amber-700/60'
                }`}
                title="Validate current XML document against W3C XSD Schema definition"
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>XSD Validation</span>
                {xsdValidationResult && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    xsdValidationResult.valid
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/40'
                      : 'bg-red-500/30 text-red-200 border border-red-500/40'
                  }`}>
                    {xsdValidationResult.valid ? '✓ Valid' : `✕ ${xsdValidationResult.errors.length}`}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsXmlTreeOpen(!isXmlTreeOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[11px] font-bold shadow-sm transition-all cursor-pointer ${
                  isXmlTreeOpen
                    ? 'bg-amber-500 text-slate-950 border border-amber-400'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                }`}
                title="Toggle XML Structure Explorer Tree side panel"
              >
                <FolderTree className="w-3.5 h-3.5 text-amber-400" />
                <span>XML Tree Explorer</span>
              </button>

              {onOpenSqlDb && (
                <button
                  onClick={onOpenSqlDb}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 rounded text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                  title="Open SQL Database Studio (PostgreSQL, MySQL, SQLite)"
                >
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SQL Studio</span>
                </button>
              )}

              {xmlToJsonStatus && (
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold animate-fade-in ${
                  xmlToJsonStatus.isError
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {xmlToJsonStatus.text}
                </span>
              )}
            </>
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

      {/* XML Structure Tag Quick-Pill Bar */}
      {activeFile?.type === 'xml' && (
        <div className={`px-3 py-1.5 border-b flex items-center justify-between text-xs overflow-x-auto ${
          isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
        }`}>
          <div className="flex items-center space-x-2 shrink-0">
            <Code className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-[11px] tracking-wide">XML Structure Tags:</span>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5 ml-2">
            {/* Open Parent Tag Closing Suggestion Pill */}
            {openParentXmlTags.length > 0 && (
              <button
                onClick={() => handleInsertXmlTagPill(openParentXmlTags[openParentXmlTags.length - 1], 'closing')}
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[10px] shadow-sm transition-all animate-pulse shrink-0 cursor-pointer"
                title={`Close parent tag </${openParentXmlTags[openParentXmlTags.length - 1]}>`}
              >
                <span>Close &lt;/{openParentXmlTags[openParentXmlTags.length - 1]}&gt;</span>
              </button>
            )}

            {/* Document Discovered Tags Pills */}
            {documentXmlTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleInsertXmlTagPill(tag, 'paired')}
                className={`flex items-center space-x-0.5 px-2 py-0.5 rounded text-[10px] font-mono transition-all shrink-0 cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 hover:bg-amber-900/60 text-amber-300 border border-slate-700 hover:border-amber-500/50'
                    : 'bg-white hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
                title={`Insert <${tag}></${tag}>`}
              >
                <span>&lt;{tag}&gt;</span>
              </button>
            ))}

            {documentXmlTags.length === 0 && (
              <span className="text-[10px] italic text-slate-500">Type &lt; to trigger auto-complete</span>
            )}
          </div>
        </div>
      )}

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
                const lineIssues = ['html', 'css', 'js', 'ts', 'groovy', 'xml'].includes(activeFile.type) ? issuesByLine.get(lineNum) : undefined;
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

            {/* Editor Canvas Area with Overlay & Auto-Complete Floating Menu */}
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
                onChange={(e) => {
                  onFileContentChange(activeFile.id, e.target.value);
                  const pos = e.target.selectionStart;
                  setXmlCursorPos(pos);
                  if (activeFile.type === 'xml') {
                    const charBefore = e.target.value[pos - 1];
                    if (charBefore === '<' || charBefore === '/') {
                      setIsXmlAutoCompleteOpen(true);
                      setSelectedXmlSuggestionIndex(0);
                    }
                  }
                }}
                onKeyDown={handleTextareaKeyDown}
                onClick={(e) => setXmlCursorPos((e.target as HTMLTextAreaElement).selectionStart)}
                onKeyUp={(e) => setXmlCursorPos((e.target as HTMLTextAreaElement).selectionStart)}
                onSelect={(e) => setXmlCursorPos((e.target as HTMLTextAreaElement).selectionStart)}
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

              {/* Floating XML Auto-Completion Suggestion Menu */}
              {activeFile?.type === 'xml' && isXmlAutoCompleteOpen && xmlCompletionsData.suggestions.length > 0 && (
                <div className="absolute right-4 top-4 z-40 w-80 max-h-72 overflow-y-auto rounded-xl bg-slate-900/95 backdrop-blur text-slate-100 shadow-2xl border border-amber-500/40 p-2 font-sans text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 px-2">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>XML Tag Completions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-[9px] text-slate-400 font-mono">
                        {xmlCompletionsData.query ? `"${xmlCompletionsData.query}"` : 'Structure'}
                      </span>
                      <button
                        onClick={() => setIsXmlAutoCompleteOpen(false)}
                        className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-0.5 pt-1">
                    {xmlCompletionsData.suggestions.map((sug, idx) => {
                      const isSelected = idx === selectedXmlSuggestionIndex;
                      return (
                        <div
                          key={sug.label + idx}
                          onClick={() => handleApplyXmlSuggestion(sug)}
                          onMouseEnter={() => setSelectedXmlSuggestionIndex(idx)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 font-semibold shadow'
                              : 'hover:bg-slate-800/80 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <Tag className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                            <span className="font-mono text-xs truncate">{sug.label}</span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0 ml-2">
                            <span className={`text-[9px] px-1 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-slate-900/40 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {sug.type}
                            </span>
                            <ChevronRight className="w-3 h-3 opacity-60" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-800/80 pt-1 px-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                    <span>↑↓ Navigate</span>
                    <span>Enter/Tab Insert</span>
                    <span>Esc Close</span>
                  </div>
                </div>
              )}
            </div>

            {/* XML Structure Explorer Side Panel */}
            {activeFile?.type === 'xml' && isXmlTreeOpen && (
              <XmlStructureExplorer
                xmlContent={activeFile.content}
                cursorOffset={xmlCursorPos}
                onSelectNode={(offset) => {
                  setXmlCursorPos(offset);
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(offset, offset);
                  }
                }}
                onClose={() => setIsXmlTreeOpen(false)}
                isDark={isDark}
              />
            )}
          </div>

          {/* Breadcrumb-Style Navigation Bar for Current XML Tag Hierarchy */}
          {activeFile?.type === 'xml' && (
            <div className={`px-3 py-1.5 border-t flex items-center space-x-1.5 text-xs font-mono select-none overflow-x-auto shrink-0 z-20 ${
              isDark 
                ? 'bg-slate-950/95 border-slate-800 text-slate-300' 
                : 'bg-slate-100/90 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center space-x-1.5 shrink-0 pr-2 border-r border-slate-700/40 text-[11px] font-sans font-semibold text-amber-500">
                <Layers className="w-3.5 h-3.5" />
                <span>XML Path:</span>
              </div>

              {xmlBreadcrumbs.length > 0 ? (
                <div className="flex items-center space-x-1 overflow-x-auto py-0.5 scrollbar-none">
                  {xmlBreadcrumbs.map((node, index) => {
                    const isLast = index === xmlBreadcrumbs.length - 1;
                    return (
                      <div key={`${node.tagName}-${node.startOffset}-${index}`} className="flex items-center space-x-1 shrink-0">
                        {index > 0 && (
                          <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 opacity-70" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleJumpToXmlTag(node.startOffset)}
                          className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                            isLast
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 font-bold shadow-xs'
                              : isDark
                                ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                          title={`Click to jump to <${node.tagName}> in editor`}
                        >
                          <Tag className={`w-3 h-3 ${isLast ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span>{node.tagName}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 italic">
                  <Tag className="w-3 h-3 opacity-50" />
                  <span>&lt;document-root&gt;</span>
                </div>
              )}
            </div>
          )}

          {/* Real-Time Multi-Language Diagnostics / Linter Drawer */}
          {['html', 'css', 'js', 'ts', 'groovy', 'xml'].includes(activeFile?.type || '') && isLinterOpen && (
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
                          {issue.suggestion && (
                            <div className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded w-fit mt-1">
                              💡 {issue.suggestion}
                            </div>
                          )}
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

          {/* Accessibility Auditor Bottom Panel Drawer */}
          {isA11yAuditorOpen && activeFile?.type === 'html' && (
            <div className={`border-t h-80 flex flex-col z-20 shadow-2xl transition-all ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/90 shrink-0">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-xs tracking-tight text-slate-200">HTML Accessibility & WCAG 2.1 Auditor</span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">({activeFile.name})</span>
                </div>
                <button
                  onClick={() => setIsA11yAuditorOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                  title="Close Accessibility Auditor Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <A11yAuditorPanel
                  files={files}
                  activeHtmlContent={activeFile.content}
                  onUpdateHtmlContent={(newHtml) => {
                    onFileContentChange(activeFile.id, newHtml);
                  }}
                  themeMode={themeMode}
                />
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
          <div className={`border rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-bold flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Create New Project File</span>
              </div>
              <button
                onClick={() => setShowNewFileModal(false)}
                className={`text-slate-400 hover:text-white p-1 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </h3>

            {/* Quick Web Policy Presets Banner */}
            <div className={`p-3 rounded-xl border space-y-2 ${
              isDark ? 'bg-indigo-950/40 border-indigo-900/60' : 'bg-indigo-50/80 border-indigo-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span className="flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Quick Web Policy Presets</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">1-Click Auto Creation</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {WEB_POLICY_PRESETS.map((preset) => {
                  const exists = files.some((f) => f.name.toLowerCase() === preset.filename.toLowerCase());
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        if (exists) {
                          const f = files.find((item) => item.name.toLowerCase() === preset.filename.toLowerCase());
                          if (f) onSelectFile(f.id);
                        } else {
                          onAddNewFile(preset.filename, 'txt', preset.defaultContent);
                        }
                        setShowNewFileModal(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                        exists
                          ? isDark ? 'bg-slate-800/80 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : isDark ? 'bg-slate-900/80 border-indigo-800/60 hover:bg-slate-800 text-indigo-200' : 'bg-white border-indigo-200 hover:bg-indigo-100 text-indigo-900'
                      }`}
                    >
                      <div className="truncate font-mono text-[11px] font-bold">
                        {preset.filename}
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        exists ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {exists ? 'Open' : '+ Create'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleCreateFile} className="space-y-4 pt-1">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Custom File Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. main.ts, script.groovy, app.js, trust.txt"
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
                  <option value="xml">XML Document (.xml)</option>
                  <option value="txt">Plain Text / Policy (.txt)</option>
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow cursor-pointer"
                >
                  Create File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* XSD Schema Validation Modal */}
      <XsdValidationModal
        isOpen={isXsdModalOpen}
        onClose={() => setIsXsdModalOpen(false)}
        xmlContent={activeFile?.content || ''}
        xmlFileName={activeFile?.name || 'document.xml'}
        xsdSchemaText={xsdSchemaText}
        onSaveSchema={(newSchema, liveVal) => {
          setXsdSchemaText(newSchema);
          setIsXsdLiveValidationEnabled(liveVal);
        }}
        isLiveValidationEnabled={isXsdLiveValidationEnabled}
        projectFiles={files}
        validationResult={xsdValidationResult}
        onValidateNow={() => {
          if (activeFile && activeFile.type === 'xml') {
            const res = validateXmlAgainstXsd(activeFile.content, xsdSchemaText);
            if (!res.valid) {
              setIsLinterOpen(true);
            }
          }
        }}
        onSaveAsProjectFile={(name, content) => {
          onAddNewFile(name, 'xml', content);
        }}
        isDark={isDark}
      />
    </div>
  );
};

