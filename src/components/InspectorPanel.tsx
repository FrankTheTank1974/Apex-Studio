import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SelectedElementInfo, ThemeMode, ProjectFile } from '../types';
import { GradientBuilder } from './GradientBuilder';
import { CssVarAutoSuggestInput, DiscoveredCssVariable } from './CssVarAutoSuggestInput';
import { AnimationBuilder } from './AnimationBuilder';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { ShadowBorderControlPanel } from './ShadowBorderControlPanel';
import { A11yAuditorPanel } from './A11yAuditorPanel';
import { 
  Type, 
  Palette, 
  Box, 
  Maximize2, 
  Layers, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Sliders, 
  Sparkles,
  Check,
  Workflow,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Film,
  Play,
  Volume2,
  HelpCircle,
  Zap,
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveHorizontal,
  Link as LinkIcon,
  ExternalLink,
  Anchor,
  Globe,
  Plus,
  RotateCcw,
  Paintbrush,
  History,
  ShieldCheck
} from 'lucide-react';

export interface ThemeVariables {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  surfaceColor: string;
  borderColor: string;
  fontHeading: string;
  fontBody: string;
  fontSizeBase: string;
  borderRadiusBase: string;
}

export const DEFAULT_THEME_VARS: ThemeVariables = {
  primaryColor: '#6366f1',
  secondaryColor: '#a855f7',
  bgColor: '#ffffff',
  textColor: '#0f172a',
  surfaceColor: '#f8fafc',
  borderColor: '#e2e8f0',
  fontHeading: "system-ui, -apple-system, sans-serif",
  fontBody: "system-ui, -apple-system, sans-serif",
  fontSizeBase: '16px',
  borderRadiusBase: '12px'
};

export const PRESET_THEMES: Array<{ name: string; vars: ThemeVariables; previewColor: string }> = [
  {
    name: 'Modern SaaS (Indigo)',
    previewColor: '#6366f1',
    vars: {
      primaryColor: '#6366f1',
      secondaryColor: '#a855f7',
      bgColor: '#ffffff',
      textColor: '#0f172a',
      surfaceColor: '#f8fafc',
      borderColor: '#e2e8f0',
      fontHeading: "system-ui, -apple-system, sans-serif",
      fontBody: "system-ui, -apple-system, sans-serif",
      fontSizeBase: '16px',
      borderRadiusBase: '12px'
    }
  },
  {
    name: 'Emerald & Teal Tech',
    previewColor: '#10b981',
    vars: {
      primaryColor: '#10b981',
      secondaryColor: '#06b6d4',
      bgColor: '#f8fafc',
      textColor: '#022c22',
      surfaceColor: '#ffffff',
      borderColor: '#cbd5e1',
      fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontBody: "'Outfit', system-ui, sans-serif",
      fontSizeBase: '16px',
      borderRadiusBase: '8px'
    }
  },
  {
    name: 'Cyberpunk Neon Dark',
    previewColor: '#06b6d4',
    vars: {
      primaryColor: '#06b6d4',
      secondaryColor: '#f43f5e',
      bgColor: '#090d16',
      textColor: '#f8fafc',
      surfaceColor: '#1e293b',
      borderColor: '#334155',
      fontHeading: "'JetBrains Mono', monospace",
      fontBody: "system-ui, sans-serif",
      fontSizeBase: '15px',
      borderRadiusBase: '16px'
    }
  },
  {
    name: 'Sunset Amber & Rose',
    previewColor: '#f59e0b',
    vars: {
      primaryColor: '#f59e0b',
      secondaryColor: '#f43f5e',
      bgColor: '#fff8f6',
      textColor: '#1c1917',
      surfaceColor: '#ffffff',
      borderColor: '#fed7aa',
      fontHeading: "'Playfair Display', Georgia, serif",
      fontBody: "system-ui, sans-serif",
      fontSizeBase: '16px',
      borderRadiusBase: '14px'
    }
  },
  {
    name: 'Luxury Slate & Purple',
    previewColor: '#8b5cf6',
    vars: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#ec4899',
      bgColor: '#0f172a',
      textColor: '#f8fafc',
      surfaceColor: '#1e293b',
      borderColor: '#334155',
      fontHeading: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontBody: "system-ui, sans-serif",
      fontSizeBase: '16px',
      borderRadiusBase: '20px'
    }
  }
];

export function parseThemeFromCss(css: string): ThemeVariables {
  if (!css) return DEFAULT_THEME_VARS;
  const getVar = (name: string, fallback: string) => {
    const match = css.match(new RegExp(`${name}:\\s*([^;]+);`));
    return match ? match[1].trim() : fallback;
  };

  return {
    primaryColor: getVar('--primary-color', DEFAULT_THEME_VARS.primaryColor),
    secondaryColor: getVar('--secondary-color', DEFAULT_THEME_VARS.secondaryColor),
    bgColor: getVar('--bg-color', DEFAULT_THEME_VARS.bgColor),
    textColor: getVar('--text-color', DEFAULT_THEME_VARS.textColor),
    surfaceColor: getVar('--surface-color', DEFAULT_THEME_VARS.surfaceColor),
    borderColor: getVar('--border-color', DEFAULT_THEME_VARS.borderColor),
    fontHeading: getVar('--font-heading', DEFAULT_THEME_VARS.fontHeading),
    fontBody: getVar('--font-body', DEFAULT_THEME_VARS.fontBody),
    fontSizeBase: getVar('--font-size-base', DEFAULT_THEME_VARS.fontSizeBase),
    borderRadiusBase: getVar('--border-radius-base', DEFAULT_THEME_VARS.borderRadiusBase),
  };
}

export function updateThemeInCss(css: string, vars: ThemeVariables): string {
  const themeHeader = `/* === Tailwind Theme Variables & Global Styles === */`;
  const newBlock = `${themeHeader}
:root {
  --primary-color: ${vars.primaryColor};
  --secondary-color: ${vars.secondaryColor};
  --bg-color: ${vars.bgColor};
  --text-color: ${vars.textColor};
  --surface-color: ${vars.surfaceColor};
  --border-color: ${vars.borderColor};
  --font-heading: ${vars.fontHeading};
  --font-body: ${vars.fontBody};
  --font-size-base: ${vars.fontSizeBase};
  --border-radius-base: ${vars.borderRadiusBase};
}

/* Global Theme Helper Utilities */
.bg-theme-primary { background-color: var(--primary-color) !important; }
.text-theme-primary { color: var(--primary-color) !important; }
.bg-theme-secondary { background-color: var(--secondary-color) !important; }
.text-theme-secondary { color: var(--secondary-color) !important; }
.bg-theme-surface { background-color: var(--surface-color) !important; }
.text-theme-body { color: var(--text-color) !important; }
.border-theme { border-color: var(--border-color) !important; }
.rounded-theme { border-radius: var(--border-radius-base) !important; }`;

  if (css.includes('/* === Tailwind Theme Variables & Global Styles === */')) {
    const themeRegex = /\/\* === Tailwind Theme Variables & Global Styles === \*\/[\s\S]*?(?=\n\/\*|\nbody|\n\.|\n#|$)/;
    if (themeRegex.test(css)) {
      return css.replace(themeRegex, newBlock);
    }
  }

  if (css.includes(':root {')) {
    const rootRegex = /:root\s*\{[\s\S]*?\}/;
    return css.replace(rootRegex, `:root {\n  --primary-color: ${vars.primaryColor};\n  --secondary-color: ${vars.secondaryColor};\n  --bg-color: ${vars.bgColor};\n  --text-color: ${vars.textColor};\n  --surface-color: ${vars.surfaceColor};\n  --border-color: ${vars.borderColor};\n  --font-heading: ${vars.fontHeading};\n  --font-body: ${vars.fontBody};\n  --font-size-base: ${vars.fontSizeBase};\n  --border-radius-base: ${vars.borderRadiusBase};\n}`);
  }

  return `${newBlock}\n\n${css}`;
}

interface InspectorPanelProps {
  selectedElement: SelectedElementInfo | null;
  onUpdateElement: (updatedInfo: Partial<SelectedElementInfo>) => void;
  onDuplicateElement: () => void;
  onDeleteElement: () => void;
  onMoveElement: (direction: 'up' | 'down') => void;
  onOpenDrawIoWithDiagram?: (diagramId?: string) => void;
  onOpenFonts?: () => void;
  onOpenQuickLinkModal?: () => void;
  onOpenIconPicker?: () => void;
  cssContent?: string;
  activeHtmlContent?: string;
  files?: ProjectFile[];
  onUpdateCssContent?: (newCss: string) => void;
  onUpdateHtmlContent?: (newHtml: string) => void;
  onRestoreFiles?: (restoredFiles: ProjectFile[]) => void;
  themeMode?: ThemeMode;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveElement,
  onOpenDrawIoWithDiagram,
  onOpenFonts,
  onOpenQuickLinkModal,
  onOpenIconPicker,
  cssContent = '',
  activeHtmlContent = '',
  files,
  onUpdateCssContent,
  onUpdateHtmlContent,
  onRestoreFiles,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [activeTab, setActiveTab] = useState<'element' | 'animations' | 'theme' | 'history' | 'a11y'>('element');
  const [themeVars, setThemeVars] = useState<ThemeVariables>(() => parseThemeFromCss(cssContent));
  const [copiedThemeCss, setCopiedThemeCss] = useState(false);

  // Extract CSS custom properties defined across project stylesheets
  const availableCssVars = useMemo<DiscoveredCssVariable[]>(() => {
    const varsMap = new Map<string, DiscoveredCssVariable>();

    const cssSources: { content: string; filename: string }[] = [];
    if (cssContent) {
      cssSources.push({ content: cssContent, filename: 'styles.css' });
    }
    if (files) {
      for (const f of files) {
        if (f.type === 'css' && f.content && f.name !== 'styles.css') {
          cssSources.push({ content: f.content, filename: f.name });
        }
      }
    }

    for (const src of cssSources) {
      const regex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;}\n]+)/g;
      let match;
      while ((match = regex.exec(src.content)) !== null) {
        const name = match[1].trim();
        const value = match[2].trim();
        const isColor =
          /^#([0-9a-f]{3,8})$/i.test(value) ||
          /^rgba?\(.*?\)/i.test(value) ||
          /^hsla?\(.*?\)/i.test(value) ||
          ['red', 'blue', 'green', 'black', 'white', 'transparent', 'indigo', 'cyan', 'purple', 'emerald', 'amber', 'slate', 'rose'].some((c) =>
            value.toLowerCase().includes(c)
          );

        if (!varsMap.has(name)) {
          varsMap.set(name, {
            name,
            value,
            varRef: `var(${name})`,
            sourceFile: src.filename,
            isColor,
          });
        }
      }
    }

    return Array.from(varsMap.values());
  }, [cssContent, files]);

  const [textContent, setTextContent] = useState(selectedElement?.textContent || '');
  const [classList, setClassList] = useState(selectedElement?.classList?.join(' ') || '');
  const [newClass, setNewClass] = useState('');
  const [attributes, setAttributes] = useState<Record<string, string>>(selectedElement?.attributes || {});
  const [showFormatDocs, setShowFormatDocs] = useState(true);
  const [copiedClasses, setCopiedClasses] = useState(false);
  const [chipCopied, setChipCopied] = useState<string | null>(null);
  const classTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedElement) {
      setTextContent(selectedElement.textContent || '');
      setClassList(selectedElement.classList?.join(' ') || '');
      setAttributes(selectedElement.attributes || {});
    }
  }, [selectedElement]);

  useEffect(() => {
    if (cssContent) {
      setThemeVars(parseThemeFromCss(cssContent));
    }
  }, [cssContent]);

  const handleUpdateThemeVar = (key: keyof ThemeVariables, value: string) => {
    const updated = { ...themeVars, [key]: value };
    setThemeVars(updated);
    if (onUpdateCssContent) {
      const newCss = updateThemeInCss(cssContent, updated);
      onUpdateCssContent(newCss);
    }
  };

  const handleApplyPreset = (presetVars: ThemeVariables) => {
    setThemeVars(presetVars);
    if (onUpdateCssContent) {
      const newCss = updateThemeInCss(cssContent, presetVars);
      onUpdateCssContent(newCss);
    }
  };

  const handleResetTheme = () => {
    handleApplyPreset(DEFAULT_THEME_VARS);
  };

  const handleCopyThemeCss = () => {
    const rootCss = `:root {
  --primary-color: ${themeVars.primaryColor};
  --secondary-color: ${themeVars.secondaryColor};
  --bg-color: ${themeVars.bgColor};
  --text-color: ${themeVars.textColor};
  --surface-color: ${themeVars.surfaceColor};
  --border-color: ${themeVars.borderColor};
  --font-heading: ${themeVars.fontHeading};
  --font-body: ${themeVars.fontBody};
  --font-size-base: ${themeVars.fontSizeBase};
  --border-radius-base: ${themeVars.borderRadiusBase};
}`;
    try {
      navigator.clipboard.writeText(rootCss);
    } catch {
      // ignore
    }
    setCopiedThemeCss(true);
    setTimeout(() => setCopiedThemeCss(false), 2000);
  };

  const tagNameLower = selectedElement?.tagName?.toLowerCase() || '';

  const isSvgOrDiagram = 
    tagNameLower === 'svg' ||
    tagNameLower === 'path' ||
    tagNameLower === 'g' ||
    tagNameLower === 'rect' ||
    tagNameLower === 'circle' ||
    tagNameLower === 'polygon' ||
    tagNameLower === 'ellipse' ||
    tagNameLower === 'line' ||
    tagNameLower === 'polyline' ||
    selectedElement?.classList?.includes('drawio-container') ||
    selectedElement?.classList?.includes('diagram-viewport') ||
    selectedElement?.classList?.includes('diagram-title') ||
    Boolean(selectedElement?.attributes?.['data-diagram-id']);

  const isButtonOrLink = 
    !isSvgOrDiagram && (
      tagNameLower === 'button' ||
      tagNameLower === 'a' ||
      selectedElement?.classList?.some(c => c.includes('btn') || c.includes('button'))
    );

  const isMediaAsset = 
    !isSvgOrDiagram && (
      tagNameLower === 'img' ||
      tagNameLower === 'video' ||
      tagNameLower === 'audio' ||
      selectedElement?.classList?.some(c => c.includes('media-card') || c.includes('media-container')) ||
      (attributes.src !== undefined && attributes.src !== '')
    );

  const handleApplyText = () => {
    if (selectedElement) {
      onUpdateElement({ textContent });
    }
  };

  const cleanClassString = (rawText: string) => {
    if (!rawText) return '';
    return rawText
      .replace(/className\s*=\s*["'`{]([^"'`}]+)["'`}]/g, '$1')
      .replace(/class\s*=\s*["'`{]([^"'`}]+)["'`}]/g, '$1')
      .replace(/["'`{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleApplyClasses = (classesStr: string) => {
    const cleaned = cleanClassString(classesStr);
    const newArr = cleaned.split(' ').filter(Boolean);
    setClassList(cleaned);
    onUpdateElement({ classList: newArr });
  };

  const handleApplyGradient = (gradientClasses: string) => {
    const currentList = cleanClassString(classList);
    const cleanClasses = currentList
      .split(' ')
      .filter(Boolean)
      .filter((cls) => {
        if (cls.startsWith('bg-gradient-to-')) return false;
        if (cls.startsWith('from-')) return false;
        if (cls.startsWith('via-')) return false;
        if (cls.startsWith('to-')) return false;
        if (cls === 'bg-clip-text' || cls === 'text-transparent') return false;
        return true;
      });

    const updatedStr = [...cleanClasses, gradientClasses].join(' ').trim();
    handleApplyClasses(updatedStr);
    setCopiedClasses(true);
    setTimeout(() => setCopiedClasses(false), 2000);
  };

  const handleCopyClasses = (customText?: string) => {
    const textToCopy = customText !== undefined ? customText : classList;
    if (!textToCopy) return;
    try {
      navigator.clipboard.writeText(textToCopy);
    } catch {
      // Fallback
    }
    if (customText) {
      setChipCopied(customText);
      setTimeout(() => setChipCopied(null), 1500);
    } else {
      setCopiedClasses(true);
      setTimeout(() => setCopiedClasses(false), 2000);
    }
  };

  const handlePasteClasses = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          const cleaned = cleanClassString(clipboardText);
          if (cleaned) {
            handleApplyClasses(cleaned);
            setCopiedClasses(true);
            setTimeout(() => setCopiedClasses(false), 2000);
            return;
          }
        }
      }
    } catch {
      // Ignore restriction
    }

    if (classTextareaRef.current) {
      classTextareaRef.current.focus();
      classTextareaRef.current.select();
    }
    setChipCopied('Box focused — press Ctrl+V (or Cmd+V) to paste!');
    setTimeout(() => setChipCopied(null), 3000);
  };

  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText) {
      e.preventDefault();
      const cleaned = cleanClassString(pastedText);
      const currentList = cleanClassString(classList);
      const combined = currentList ? `${currentList} ${cleaned}` : cleaned;
      handleApplyClasses(combined);
      setCopiedClasses(true);
      setTimeout(() => setCopiedClasses(false), 2000);
    }
  };

  const handleClearClasses = () => {
    handleApplyClasses('');
  };

  const handleAddQuickClass = (className: string) => {
    const current = classList.split(' ').filter(Boolean);
    if (!current.includes(className)) {
      const updated = [...current, className].join(' ');
      handleApplyClasses(updated);
    }
  };

  const handleRemoveClass = (cls: string) => {
    const updated = classList.split(' ').filter((c) => c !== cls).join(' ');
    handleApplyClasses(updated);
  };

  const handleAttributeChange = (key: string, value: string) => {
    const updated = { ...attributes, [key]: value };
    setAttributes(updated);
    onUpdateElement({ attributes: updated });
  };

  const handleSetPlacement = (type: 'left' | 'center' | 'right' | 'full') => {
    const current = classList.split(' ').filter(Boolean);
    const alignClassesToRemove = [
      'mr-auto', 'ml-0', 'mx-auto', 'ml-auto', 'mr-0',
      'justify-start', 'justify-center', 'justify-end',
      'text-left', 'text-center', 'text-right',
      'self-start', 'self-center', 'self-end',
      'w-full', 'w-auto'
    ];
    const filtered = current.filter((c) => !alignClassesToRemove.includes(c));

    let added: string[] = [];
    if (type === 'left') {
      added = ['mr-auto', 'ml-0', 'text-left'];
    } else if (type === 'center') {
      added = ['mx-auto', 'text-center'];
    } else if (type === 'right') {
      added = ['ml-auto', 'mr-0', 'text-right'];
    } else if (type === 'full') {
      added = ['w-full', 'text-center'];
    }

    const updated = [...filtered, ...added].join(' ');
    handleApplyClasses(updated);
  };

  const buttonPresetStyle = isDark
    ? 'p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center text-slate-300'
    : 'p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-center text-slate-700';

  return (
    <div className={`w-80 shrink-0 border-l flex flex-col h-full text-xs select-none z-10 relative transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {/* Top Tab Bar Switcher */}
      <div className={`flex items-center border-b p-1.5 space-x-1 shrink-0 overflow-x-auto whitespace-nowrap custom-scrollbar ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <button
          type="button"
          onClick={() => setActiveTab('element')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer shrink-0 ${
            activeTab === 'element'
              ? isDark
                ? 'bg-slate-800 text-white shadow-2xs border border-slate-700'
                : 'bg-white text-slate-900 shadow-2xs border border-slate-200'
              : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Element</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('animations')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer shrink-0 ${
            activeTab === 'animations'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Animations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer shrink-0 ${
            activeTab === 'theme'
              ? isDark
                ? 'bg-slate-800 text-white shadow-2xs border border-slate-700'
                : 'bg-white text-slate-900 shadow-2xs border border-slate-200'
              : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>Theme</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('a11y')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer shrink-0 ${
            activeTab === 'a11y'
              ? isDark
                ? 'bg-slate-800 text-white shadow-2xs border border-slate-700'
                : 'bg-white text-slate-900 shadow-2xs border border-slate-200'
              : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Accessibility Auditor & WCAG Compliance"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>A11y</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer shrink-0 ${
            activeTab === 'history'
              ? isDark
                ? 'bg-slate-800 text-white shadow-2xs border border-slate-700'
                : 'bg-white text-slate-900 shadow-2xs border border-slate-200'
              : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>History</span>
        </button>
      </div>

      {/* ACCESSIBILITY AUDITOR TAB */}
      {activeTab === 'a11y' ? (
        <A11yAuditorPanel
          files={files || []}
          activeHtmlContent={activeHtmlContent}
          onUpdateHtmlContent={onUpdateHtmlContent}
          themeMode={themeMode}
        />
      ) : activeTab === 'history' ? (
        <div className="flex-1 overflow-y-auto p-3">
          <VersionHistoryPanel
            files={files || []}
            onRestoreFiles={(restored) => {
              if (onRestoreFiles) {
                onRestoreFiles(restored);
              }
            }}
            isDark={isDark}
          />
        </div>
      ) : activeTab === 'animations' ? (
        <div className="flex-1 overflow-y-auto p-3">
          <AnimationBuilder
            selectedElement={selectedElement}
            onUpdateElement={onUpdateElement}
            cssContent={cssContent}
            onUpdateCssContent={onUpdateCssContent}
            isDark={isDark}
          />
        </div>
      ) : activeTab === 'theme' ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Header banner */}
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold flex items-center space-x-1.5 text-indigo-500">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Tailwind Theme Variables</span>
              </span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleCopyThemeCss}
                  className={`p-1.5 rounded text-[10px] font-semibold border flex items-center space-x-1 transition-all cursor-pointer ${
                    copiedThemeCss
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                  title="Copy CSS :root Variables"
                >
                  {copiedThemeCss ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedThemeCss ? 'Copied' : 'Copy CSS'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetTheme}
                  className={`p-1.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Reset to Default Theme"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Customize root CSS custom properties and theme colors. Changes update live in canvas & <code className="text-indigo-400 font-mono text-[10px]">styles.css</code>.
            </p>
          </div>

          {/* Live Theme Preview Component */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>Live Theme Preview</span>
              <span className="text-[10px] text-indigo-400 font-mono">CSS Variables Active</span>
            </label>
            <div 
              className="p-3.5 rounded-xl border shadow-sm transition-all space-y-2.5"
              style={{
                backgroundColor: themeVars.surfaceColor,
                borderColor: themeVars.borderColor,
                borderRadius: themeVars.borderRadiusBase,
                color: themeVars.textColor,
                fontFamily: themeVars.fontBody
              }}
            >
              <div className="flex items-center justify-between">
                <span 
                  className="text-xs font-bold truncate max-w-[170px]"
                  style={{ fontFamily: themeVars.fontHeading, color: themeVars.textColor }}
                >
                  Sample UI Component
                </span>
                <span 
                  className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
                  style={{ backgroundColor: themeVars.secondaryColor, color: '#ffffff', borderRadius: '4px' }}
                >
                  Badge
                </span>
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                Primary action buttons, backgrounds, and borders automatically inherit these values.
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-bold text-white transition-all shadow-xs cursor-pointer"
                  style={{
                    backgroundColor: themeVars.primaryColor,
                    borderRadius: themeVars.borderRadiusBase
                  }}
                >
                  Button
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer"
                  style={{
                    borderColor: themeVars.borderColor,
                    color: themeVars.textColor,
                    borderRadius: themeVars.borderRadiusBase
                  }}
                >
                  Outline
                </button>
              </div>
            </div>
          </div>

          {/* Color Palettes Presets */}
          <div className="space-y-2">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Color Swatch Presets
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {PRESET_THEMES.map((preset) => {
                const isActive = themeVars.primaryColor === preset.vars.primaryColor && themeVars.secondaryColor === preset.vars.secondaryColor;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset.vars)}
                    className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                        : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs shrink-0" style={{ backgroundColor: preset.previewColor }} />
                      <span className="text-[11px] font-semibold">{preset.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: preset.vars.bgColor }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: preset.vars.primaryColor }} />
                      <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: preset.vars.secondaryColor }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker UI Section with Auto-Suggest */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className={`text-xs font-semibold flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>Theme Color Pickers</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-mono font-semibold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Auto-Suggest Active</span>
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Primary Brand Color */}
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <CssVarAutoSuggestInput
                  label="Primary Brand"
                  value={themeVars.primaryColor}
                  onChange={(val) => handleUpdateThemeVar('primaryColor', val)}
                  colorPickerValue={themeVars.primaryColor}
                  onColorPickerChange={(val) => handleUpdateThemeVar('primaryColor', val)}
                  availableVars={availableCssVars}
                  typeFilter="color"
                  isDark={isDark}
                  placeholder="#6366f1 or var(...)"
                />
              </div>

              {/* Secondary Accent Color */}
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <CssVarAutoSuggestInput
                  label="Secondary Accent"
                  value={themeVars.secondaryColor}
                  onChange={(val) => handleUpdateThemeVar('secondaryColor', val)}
                  colorPickerValue={themeVars.secondaryColor}
                  onColorPickerChange={(val) => handleUpdateThemeVar('secondaryColor', val)}
                  availableVars={availableCssVars}
                  typeFilter="color"
                  isDark={isDark}
                  placeholder="#a855f7 or var(...)"
                />
              </div>

              {/* Canvas Background Color */}
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <CssVarAutoSuggestInput
                  label="Canvas Background"
                  value={themeVars.bgColor}
                  onChange={(val) => handleUpdateThemeVar('bgColor', val)}
                  colorPickerValue={themeVars.bgColor}
                  onColorPickerChange={(val) => handleUpdateThemeVar('bgColor', val)}
                  availableVars={availableCssVars}
                  typeFilter="color"
                  isDark={isDark}
                  placeholder="#ffffff or var(...)"
                />
              </div>

              {/* Body Text Color */}
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <CssVarAutoSuggestInput
                  label="Body Text Color"
                  value={themeVars.textColor}
                  onChange={(val) => handleUpdateThemeVar('textColor', val)}
                  colorPickerValue={themeVars.textColor}
                  onColorPickerChange={(val) => handleUpdateThemeVar('textColor', val)}
                  availableVars={availableCssVars}
                  typeFilter="color"
                  isDark={isDark}
                  placeholder="#0f172a or var(...)"
                />
              </div>

              {/* Surface / Card Color */}
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <CssVarAutoSuggestInput
                  label="Card / Surface BG"
                  value={themeVars.surfaceColor}
                  onChange={(val) => handleUpdateThemeVar('surfaceColor', val)}
                  colorPickerValue={themeVars.surfaceColor}
                  onColorPickerChange={(val) => handleUpdateThemeVar('surfaceColor', val)}
                  availableVars={availableCssVars}
                  typeFilter="color"
                  isDark={isDark}
                  placeholder="#f8fafc or var(...)"
                />
              </div>

              {/* Border Color */}
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <CssVarAutoSuggestInput
                  label="Border / Line Color"
                  value={themeVars.borderColor}
                  onChange={(val) => handleUpdateThemeVar('borderColor', val)}
                  colorPickerValue={themeVars.borderColor}
                  onColorPickerChange={(val) => handleUpdateThemeVar('borderColor', val)}
                  availableVars={availableCssVars}
                  typeFilter="color"
                  isDark={isDark}
                  placeholder="#e2e8f0 or var(...)"
                />
              </div>
            </div>
          </div>

          {/* Typography & Fonts Section */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className={`text-xs font-semibold flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="flex items-center space-x-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-400" />
                <span>Typography & Fonts</span>
              </span>
              {onOpenFonts && (
                <button
                  type="button"
                  onClick={onOpenFonts}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                >
                  Google Fonts Studio
                </button>
              )}
            </label>

            <div className="space-y-2 text-xs">
              <div>
                <CssVarAutoSuggestInput
                  label="Heading Font Family"
                  value={themeVars.fontHeading}
                  onChange={(val) => handleUpdateThemeVar('fontHeading', val)}
                  availableVars={availableCssVars}
                  typeFilter="font"
                  isDark={isDark}
                  placeholder="e.g. 'Plus Jakarta Sans', sans-serif"
                  presetOptions={[
                    { label: 'System Sans-Serif', value: 'system-ui, -apple-system, sans-serif' },
                    { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', system-ui, sans-serif" },
                    { label: 'Playfair Display (Serif)', value: "'Playfair Display', Georgia, serif" },
                    { label: 'JetBrains Mono (Code)', value: "'JetBrains Mono', monospace" }
                  ]}
                />
              </div>

              <div>
                <CssVarAutoSuggestInput
                  label="Body Font Family"
                  value={themeVars.fontBody}
                  onChange={(val) => handleUpdateThemeVar('fontBody', val)}
                  availableVars={availableCssVars}
                  typeFilter="font"
                  isDark={isDark}
                  placeholder="e.g. 'Outfit', sans-serif"
                  presetOptions={[
                    { label: 'System Sans-Serif', value: 'system-ui, -apple-system, sans-serif' },
                    { label: 'Outfit', value: "'Outfit', system-ui, sans-serif" },
                    { label: 'Roboto', value: "'Roboto', sans-serif" },
                    { label: 'Monospace', value: "monospace" }
                  ]}
                />
              </div>

              <div>
                <label className={`text-[10px] font-medium block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Base Font Size
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['14px', '16px', '18px'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleUpdateThemeVar('fontSizeBase', size)}
                      className={`py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        themeVars.fontSizeBase === size
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : isDark
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Border Radius Section */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Border Radius Theme Variable
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {[
                { label: '0px Sharp', value: '0px' },
                { label: '6px Small', value: '6px' },
                { label: '12px Std', value: '12px' },
                { label: '20px Round', value: '20px' }
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleUpdateThemeVar('borderRadiusBase', r.value)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold border text-center transition-all cursor-pointer ${
                    themeVars.borderRadiusBase === r.value
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cheatsheet for Tailwind Theme Utilities */}
          <div className={`p-3 rounded-xl border text-[10px] space-y-1 font-mono ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="font-bold text-indigo-400">Available Theme Utilities:</div>
            <div>.bg-theme-primary / .text-theme-primary</div>
            <div>.bg-theme-secondary / .text-theme-secondary</div>
            <div>.bg-theme-surface / .border-theme</div>
          </div>
        </div>
      ) : (
        /* ELEMENT INSPECTOR TAB */
        !selectedElement ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-xs overflow-y-auto">
            <Sliders className={`w-8 h-8 mb-3 stroke-1 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={`font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>No Element Selected</p>
            <p className={`max-w-[200px] leading-relaxed mb-6 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              Click on any text, button, container or image in the visual canvas to inspect and edit its styles & HTML attributes.
            </p>

            <div className="w-full max-w-[220px] space-y-2">
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className="w-full p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm mb-2"
              >
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>Edit Global Styles & Colors</span>
              </button>

              {/* Quick Link Creator Shortcut */}
              {onOpenQuickLinkModal && (
                <button
                  type="button"
                  onClick={onOpenQuickLinkModal}
                  className="w-full p-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 dark:text-cyan-300 font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  <span>Quick Link & Anchor Creator</span>
                </button>
              )}

              {/* Global Google Fonts Utility Shortcut */}
              {onOpenFonts && (
                <button
                  type="button"
                  onClick={onOpenFonts}
                  className="w-full p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                >
                  <Type className="w-4 h-4 text-indigo-400" />
                  <span>Google Fonts Studio</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Header & Element Breadcrumb */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-indigo-600/30 text-indigo-400 dark:text-indigo-300 rounded font-mono font-bold uppercase text-[11px]">
                  &lt;{selectedElement.tagName.toLowerCase()}&gt;
                </span>
                <span className={`truncate max-w-[120px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {selectedElement.id ? `#${selectedElement.id}` : (selectedElement.classList?.[0] ? `.${selectedElement.classList[0]}` : 'Element')}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => onMoveElement('up')}
                  className={`p-1 rounded hover:bg-slate-800 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveElement('down')}
                  className={`p-1 rounded hover:bg-slate-800 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onDuplicateElement}
                  className={`p-1 rounded hover:bg-slate-800 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onDeleteElement}
                  className="p-1 rounded text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Placement & Align Tool */}
            <div className={`space-y-1.5 p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[11px] font-semibold flex items-center justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className="flex items-center space-x-1">
                  <MoveHorizontal className="w-3 h-3 text-indigo-400" />
                  <span>Align & Positioning</span>
                </span>
              </span>
              <div className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={() => handleSetPlacement('left')}
                  className={`py-1 px-1.5 rounded text-[10px] font-semibold border flex items-center justify-center space-x-1 transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500'
                  }`}
                  title="Align Left (mr-auto text-left)"
                >
                  <AlignLeft className="w-3 h-3 text-indigo-400" />
                  <span>Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPlacement('center')}
                  className={`py-1 px-1.5 rounded text-[10px] font-semibold border flex items-center justify-center space-x-1 transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500'
                  }`}
                  title="Center (mx-auto text-center)"
                >
                  <AlignCenter className="w-3 h-3 text-indigo-400" />
                  <span>Center</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPlacement('right')}
                  className={`py-1 px-1.5 rounded text-[10px] font-semibold border flex items-center justify-center space-x-1 transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500'
                  }`}
                  title="Align Right (ml-auto text-right)"
                >
                  <AlignRight className="w-3 h-3 text-indigo-400" />
                  <span>Right</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPlacement('full')}
                  className={`py-1 px-1.5 rounded text-[10px] font-semibold border flex items-center justify-center space-x-1 transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500'
                  }`}
                  title="Full Width (w-full)"
                >
                  <Maximize2 className="w-3 h-3 text-indigo-400" />
                  <span>Full</span>
                </button>
              </div>
            </div>

            {/* DRAW.IO VECTOR DIAGRAM CONTROLS */}
            {isSvgOrDiagram && (
              <div className="p-3 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center space-x-1.5 text-xs">
                    <Workflow className="w-4 h-4 text-amber-400" />
                    <span>Draw.io Vector Diagram</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-semibold border border-amber-500/40">
                    Live Vector
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  This vector graphic or flowchart is connected to the Draw.io engine. Edit node geometry, connections, or layout visually.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const diagramId = selectedElement.attributes?.['data-diagram-id'] || 'main-flow';
                    if (onOpenDrawIoWithDiagram) {
                      onOpenDrawIoWithDiagram(diagramId);
                    }
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer text-xs"
                >
                  <Workflow className="w-3.5 h-3.5" />
                  <span>Open in Draw.io Studio</span>
                </button>
              </div>
            )}

            {/* QUICK LINK CREATOR */}
            {isButtonOrLink && onOpenQuickLinkModal && (
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center space-x-1 text-xs">
                    <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Link & Anchor Navigation</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-mono font-semibold">a / button</span>
                </div>
                <p className="text-[11px] text-cyan-200/80 leading-relaxed">
                  Quickly attach smooth scroll anchor links, external URLs, or section targets to this button or link.
                </p>
                <button
                  type="button"
                  onClick={onOpenQuickLinkModal}
                  className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer text-xs"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Launch Link & Anchor Creator</span>
                </button>
              </div>
            )}

            {/* MEDIA ASSET IMAGE/VIDEO REPLACER */}
            {isMediaAsset && (
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center space-x-1 text-xs">
                    <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Media File & Format Replacer</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-semibold border border-purple-500/30">
                    JXL / WebP / SVG
                  </span>
                </div>
                <p className="text-[11px] text-purple-200/80 leading-relaxed">
                  Replace image/video source with local files or high-efficiency next-gen media formats (JXL, AVIF, WebP, SVG, MP4).
                </p>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-purple-300 font-semibold block">Quick URL Source</label>
                  <input
                    type="text"
                    value={attributes.src || ''}
                    onChange={(e) => handleAttributeChange('src', e.target.value)}
                    placeholder="https://..."
                    className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-purple-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* TEXT CONTENT EDIT */}
            {!isSvgOrDiagram && selectedElement.textContent !== undefined && (
              <div className="space-y-1.5">
                <label className={`font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Type className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Text Content</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyText()}
                    className={`flex-1 px-2.5 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleApplyText}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all text-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* GRADIENT BUILDER */}
            <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <GradientBuilder
                onApplyGradient={handleApplyGradient}
                themeMode={themeMode}
              />
            </div>

            {/* SHADOW & BORDER CONTROL PANEL */}
            <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <ShadowBorderControlPanel
                selectedElement={selectedElement}
                classList={classList}
                onApplyClasses={handleApplyClasses}
                attributes={attributes}
                onUpdateAttribute={handleAttributeChange}
                isDark={isDark}
              />
            </div>

            {/* TAILWIND CLASSES EDIT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tailwind Classes</span>
                </label>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={handlePasteClasses}
                    className={`px-2 py-0.5 border rounded text-[10px] font-semibold flex items-center space-x-1 transition-all ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Paste</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyClasses()}
                    className={`px-2 py-0.5 border rounded text-[10px] font-semibold flex items-center space-x-1 transition-all ${
                      copiedClasses
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {copiedClasses ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedClasses ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearClasses}
                    className="px-2 py-0.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-[10px] font-semibold transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {chipCopied && (
                <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/40 text-[11px] font-medium animate-fade-in flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{chipCopied}</span>
                </div>
              )}

              {/* Class Pills */}
              <div className={`p-2 border rounded-lg min-h-[50px] max-h-[100px] overflow-y-auto flex flex-wrap gap-1 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                {classList.split(' ').filter(Boolean).map((cls, idx) => (
                  <span
                    key={`${cls}-${idx}`}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono rounded-md group transition-all"
                  >
                    <span 
                      onClick={() => handleCopyClasses(cls)}
                      className="cursor-pointer hover:underline"
                      title="Click to copy class"
                    >
                      {cls}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(cls)}
                      className="text-indigo-400 hover:text-red-400 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {!classList.trim() && (
                  <span className={`text-[11px] italic ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    No classes applied
                  </span>
                )}
              </div>

              {/* Editable Classes Raw Input */}
              <div className="space-y-1">
                <textarea
                  ref={classTextareaRef}
                  value={classList}
                  onChange={(e) => setClassList(e.target.value)}
                  onPaste={handleTextareaPaste}
                  placeholder="Paste or type Tailwind classes (e.g. bg-indigo-600 text-white p-4 rounded-xl)..."
                  rows={2}
                  className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleApplyClasses(classList)}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all text-xs"
                >
                  Apply All Classes
                </button>
              </div>

              {/* Quick Class Adders */}
              <div className="space-y-2 pt-2">
                <span className={`text-[10px] font-semibold block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  QUICK ADD PRESETS
                </span>

                <div className="space-y-1.5">
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Colors</span>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { name: 'Indigo', class: 'bg-indigo-600 text-white' },
                      { name: 'Emerald', class: 'bg-emerald-600 text-white' },
                      { name: 'Rose', class: 'bg-rose-600 text-white' },
                      { name: 'Amber', class: 'bg-amber-600 text-slate-950' },
                      { name: 'Slate Dark', class: 'bg-slate-900 text-slate-100' },
                      { name: 'Slate Light', class: 'bg-slate-100 text-slate-900' },
                      { name: 'Cyan Glow', class: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
                      { name: 'Purple Glow', class: 'bg-purple-500/20 text-purple-300 border border-purple-500/40' },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleAddQuickClass(preset.class)}
                        className={buttonPresetStyle}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Spacing & Padding</span>
                  <div className="grid grid-cols-4 gap-1">
                    {['p-2', 'p-4', 'p-6', 'p-8', 'px-4 py-2', 'py-12', 'space-y-4', 'gap-4'].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleAddQuickClass(cls)}
                        className={buttonPresetStyle}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Border Radius & Shadows</span>
                  <div className="grid grid-cols-4 gap-1">
                    {['rounded-none', 'rounded-lg', 'rounded-xl', 'rounded-full', 'shadow-sm', 'shadow-md', 'shadow-xl', 'border border-slate-700'].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => handleAddQuickClass(cls)}
                        className={buttonPresetStyle}
                      >
                        {cls.replace('rounded-', 'r-').replace('shadow-', 's-')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* HTML ATTRIBUTES EDIT */}
            <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Box className="w-3.5 h-3.5 text-cyan-500" />
                <span>Attributes (ID, Href, Src, Alt)</span>
              </span>

              <div className="space-y-1.5">
                <div>
                  <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Element ID</label>
                  <input
                    type="text"
                    value={attributes.id || ''}
                    onChange={(e) => handleAttributeChange('id', e.target.value)}
                    placeholder="e.g. hero-title"
                    className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                {selectedElement.tagName.toLowerCase() === 'a' && (
                  <div>
                    <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Href URL</label>
                    <input
                      type="text"
                      value={attributes.href || ''}
                      onChange={(e) => handleAttributeChange('href', e.target.value)}
                      placeholder="https://..."
                      className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                )}
                {selectedElement.tagName.toLowerCase() === 'img' && (
                  <>
                    <div>
                      <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Image Source (src)</label>
                      <input
                        type="text"
                        value={attributes.src || ''}
                        onChange={(e) => handleAttributeChange('src', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Alt Text</label>
                      <input
                        type="text"
                        value={attributes.alt || ''}
                        onChange={(e) => handleAttributeChange('alt', e.target.value)}
                        placeholder="Image description"
                        className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
