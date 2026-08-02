import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Keyboard, 
  Command, 
  Sparkles, 
  Eye, 
  Code, 
  Workflow, 
  Type, 
  CloudUpload, 
  RotateCcw,
  Sliders,
  CheckCircle2,
  Laptop,
  Flame
} from 'lucide-react';
import { ThemeMode } from '../types';

export interface ShortcutItem {
  id: string;
  title: string;
  description: string;
  category: 'canvas' | 'view' | 'editor' | 'tools';
  keys: { mac: string[]; win: string[] };
  context: string;
  popular?: boolean;
}

export const SHORTCUTS_LIST: ShortcutItem[] = [
  // Canvas & Editing
  {
    id: 'undo',
    title: 'Undo Canvas Action',
    description: 'Revert the last HTML element, style, or positioning change made on the canvas',
    category: 'canvas',
    keys: { mac: ['⌘', 'Z'], win: ['Ctrl', 'Z'] },
    context: 'WYSIWYG Canvas & Editor',
    popular: true
  },
  {
    id: 'redo',
    title: 'Redo Canvas Action',
    description: 'Re-apply the previously reverted canvas action',
    category: 'canvas',
    keys: { mac: ['⌘', 'Shift', 'Z'], win: ['Ctrl', 'Y'] },
    context: 'WYSIWYG Canvas & Editor',
    popular: true
  },
  {
    id: 'delete-element',
    title: 'Delete Selected Element',
    description: 'Remove the currently active selected element from the canvas HTML tree',
    category: 'canvas',
    keys: { mac: ['Delete'], win: ['Backspace'] },
    context: 'WYSIWYG Canvas',
    popular: true
  },
  {
    id: 'inline-edit',
    title: 'Direct Inline Text Edit',
    description: 'Double click any heading or text block on live canvas to edit text content directly',
    category: 'canvas',
    keys: { mac: ['Double', 'Click'], win: ['Double', 'Click'] },
    context: 'WYSIWYG Canvas',
    popular: true
  },
  {
    id: 'deselect',
    title: 'Deselect / Cancel Selection',
    description: 'Clear active element focus outline or close open modal overlays',
    category: 'canvas',
    keys: { mac: ['Esc'], win: ['Esc'] },
    context: 'Global / Canvas'
  },
  {
    id: 'move-element',
    title: 'Reorder Element Position',
    description: 'Move selected element up or down relative to its DOM siblings',
    category: 'canvas',
    keys: { mac: ['↑', '↓'], win: ['↑', '↓'] },
    context: 'Inspector / Canvas'
  },

  // View & Device Switching
  {
    id: 'view-wysiwyg',
    title: 'Switch to Canvas View',
    description: 'Focus full-screen WYSIWYG visual designer mode',
    category: 'view',
    keys: { mac: ['Alt', '1'], win: ['Alt', '1'] },
    context: 'Navbar / View Switcher',
    popular: true
  },
  {
    id: 'view-split',
    title: 'Switch to Split View',
    description: 'View live code editor and visual canvas side-by-side',
    category: 'view',
    keys: { mac: ['Alt', '2'], win: ['Alt', '2'] },
    context: 'Navbar / View Switcher',
    popular: true
  },
  {
    id: 'view-code',
    title: 'Switch to Code View',
    description: 'Focus full-screen Monaco code editor view',
    category: 'view',
    keys: { mac: ['Alt', '3'], win: ['Alt', '3'] },
    context: 'Navbar / View Switcher',
    popular: true
  },
  {
    id: 'view-preview',
    title: 'Switch to Live Preview',
    description: 'Interactive live app execution preview frame',
    category: 'view',
    keys: { mac: ['Alt', '4'], win: ['Alt', '4'] },
    context: 'Navbar / View Switcher',
    popular: true
  },
  {
    id: 'view-hosted',
    title: 'Open Hosted Webpage View',
    description: 'View webpage full-screen as if it were hosted live in production without IDE UI',
    category: 'view',
    keys: { mac: ['Alt', 'H'], win: ['Alt', 'H'] },
    context: 'Navbar / Global',
    popular: true
  },
  {
    id: 'device-desktop',
    title: 'Desktop Device View',
    description: 'Set preview frame width to 100% desktop breakpoint',
    category: 'view',
    keys: { mac: ['Ctrl', 'Shift', 'D'], win: ['Ctrl', 'Shift', 'D'] },
    context: 'Canvas Header'
  },
  {
    id: 'device-tablet',
    title: 'Tablet Device View',
    description: 'Set preview frame width to 768px tablet breakpoint',
    category: 'view',
    keys: { mac: ['Ctrl', 'Shift', 'T'], win: ['Ctrl', 'Shift', 'T'] },
    context: 'Canvas Header'
  },
  {
    id: 'device-mobile',
    title: 'Mobile Device View',
    description: 'Set preview frame width to 375px mobile breakpoint',
    category: 'view',
    keys: { mac: ['Ctrl', 'Shift', 'M'], win: ['Ctrl', 'Shift', 'M'] },
    context: 'Canvas Header'
  },

  // Code Editor Shortcuts
  {
    id: 'code-find',
    title: 'Find & Replace',
    description: 'Open in-file search and replace widget in code editor',
    category: 'editor',
    keys: { mac: ['⌘', 'F'], win: ['Ctrl', 'F'] },
    context: 'Code Editor',
    popular: true
  },
  {
    id: 'code-save',
    title: 'Save & Sync Code',
    description: 'Save current active file and update canvas preview immediately',
    category: 'editor',
    keys: { mac: ['⌘', 'S'], win: ['Ctrl', 'S'] },
    context: 'Code Editor',
    popular: true
  },
  {
    id: 'code-autocomplete',
    title: 'Trigger Auto-completion',
    description: 'Manually request HTML/CSS/JS IntelliSense completion proposals',
    category: 'editor',
    keys: { mac: ['Ctrl', 'Space'], win: ['Ctrl', 'Space'] },
    context: 'Code Editor'
  },
  {
    id: 'code-format',
    title: 'Format Document',
    description: 'Auto-format HTML/CSS/JS code structure with proper indentation',
    category: 'editor',
    keys: { mac: ['⌥', 'Shift', 'F'], win: ['Alt', 'Shift', 'F'] },
    context: 'Code Editor'
  },
  {
    id: 'code-comment',
    title: 'Toggle Line Comment',
    description: 'Comment or uncomment selected code lines',
    category: 'editor',
    keys: { mac: ['⌘', '/'], win: ['Ctrl', '/'] },
    context: 'Code Editor'
  },

  // Tools & Modals
  {
    id: 'tool-shortcuts',
    title: 'Open Keyboard Shortcuts Helper',
    description: 'Toggle this interactive hotkeys and shortcuts helper modal',
    category: 'tools',
    keys: { mac: ['?'], win: ['?'] },
    context: 'Global Shortcut',
    popular: true
  },
  {
    id: 'tool-ai',
    title: 'Open AI Copilot Assistant',
    description: 'Prompt AI to generate components, layout templates, or fix styles',
    category: 'tools',
    keys: { mac: ['⌘', 'K'], win: ['Ctrl', 'K'] },
    context: 'Global Shortcut',
    popular: true
  },
  {
    id: 'tool-drawio',
    title: 'Open Draw.io Diagrammer',
    description: 'Embed or edit interactive vector diagrams & flowcharts',
    category: 'tools',
    keys: { mac: ['Shift', 'D'], win: ['Shift', 'D'] },
    context: 'Navbar / Global'
  },
  {
    id: 'tool-fonts',
    title: 'Open Google Fonts Studio',
    description: 'Browse, preview, and apply web typography from Google Fonts catalog',
    category: 'tools',
    keys: { mac: ['Shift', 'F'], win: ['Shift', 'F'] },
    context: 'Navbar / Global'
  },
  {
    id: 'tool-export',
    title: 'Open Deploy & Cloud Hub',
    description: 'Export project to GitHub, GitLab, Vercel, or local .tar.zst archive',
    category: 'tools',
    keys: { mac: ['Shift', 'E'], win: ['Shift', 'E'] },
    context: 'Navbar / Global'
  }
];

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: ThemeMode;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'canvas' | 'view' | 'editor' | 'tools'>('all');
  const [isMac, setIsMac] = useState(true);
  const [lastPressedKeys, setLastPressedKeys] = useState<string[]>([]);
  const [matchedShortcutId, setMatchedShortcutId] = useState<string | null>(null);

  // Detect OS platform for default keyboard labels
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isApple = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
      setIsMac(isApple);
    }
  }, []);

  // Listen for Escape key to close modal & live shortcut detection testing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Record pressed key sequence for live test feedback bar
      const keysPressed: string[] = [];
      if (e.metaKey) keysPressed.push('⌘');
      if (e.ctrlKey) keysPressed.push('Ctrl');
      if (e.altKey) keysPressed.push(isMac ? '⌥' : 'Alt');
      if (e.shiftKey) keysPressed.push('Shift');

      const k = e.key.toUpperCase();
      if (!['META', 'CONTROL', 'ALT', 'SHIFT'].includes(k)) {
        if (e.key === ' ') keysPressed.push('Space');
        else if (e.key === '?') keysPressed.push('?');
        else keysPressed.push(k.length === 1 ? k : e.key);
      }

      if (keysPressed.length > 0) {
        setLastPressedKeys(keysPressed);

        // Find if this key sequence matches any registered shortcut
        const match = SHORTCUTS_LIST.find((sc) => {
          const listKeys = isMac ? sc.keys.mac : sc.keys.win;
          if (listKeys.length !== keysPressed.length) return false;
          return listKeys.every((lk, idx) => {
            const pressed = keysPressed[idx];
            if (lk === '⌘' || lk === 'Ctrl') return pressed === '⌘' || pressed === 'Ctrl';
            return lk.toLowerCase() === pressed.toLowerCase();
          });
        });

        if (match) {
          setMatchedShortcutId(match.id);
          setTimeout(() => setMatchedShortcutId(null), 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isMac]);

  if (!isOpen) return null;

  const filteredShortcuts = SHORTCUTS_LIST.filter((sc) => {
    const matchesCategory = activeCategory === 'all' || sc.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      sc.title.toLowerCase().includes(q) ||
      sc.description.toLowerCase().includes(q) ||
      sc.context.toLowerCase().includes(q) ||
      sc.keys.mac.some((k) => k.toLowerCase().includes(q)) ||
      sc.keys.win.some((k) => k.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-indigo-500/10' 
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-start justify-between relative ${
          isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight">Keyboard Shortcuts</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  IDE Hotkeys
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Master keyboard shortcuts to design, code, and navigate fluidly
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* OS Toggle Switch (Mac vs Win/Linux) */}
            <button
              onClick={() => setIsMac(!isMac)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-all ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title="Toggle shortcut keys display between Mac and Windows/Linux"
            >
              <Command className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isMac ? 'macOS Layout' : 'Windows/Linux'}</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar: Search Bar & Category Tabs */}
        <div className={`p-4 border-b space-y-3 ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts by action or key (e.g. undo, code, Alt+1)..."
                className={`w-full pl-9 pr-8 py-1.5 rounded-lg text-xs border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 focus:border-indigo-500 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Key Detection Indicator */}
            {lastPressedKeys.length > 0 && (
              <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-mono animate-in fade-in ${
                matchedShortcutId
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}>
                <span className="text-[10px] text-slate-400 font-sans uppercase font-semibold">Tested:</span>
                <div className="flex items-center space-x-1">
                  {lastPressedKeys.map((k, i) => (
                    <kbd key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-700 text-[10px] font-bold">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {[
              { id: 'all', label: 'All Hotkeys', icon: Sliders },
              { id: 'canvas', label: 'Canvas & Design', icon: Eye },
              { id: 'view', label: 'View Modes', icon: Laptop },
              { id: 'editor', label: 'Code Editor', icon: Code },
              { id: 'tools', label: 'Tools & AI', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : isDark
                        ? 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Shortcuts List Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {filteredShortcuts.length === 0 ? (
            <div className="text-center py-12">
              <Keyboard className={`w-10 h-10 mx-auto mb-3 opacity-30 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                No matching shortcuts found
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Try searching for another keyword like "undo", "code", or "preview"
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="mt-4 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredShortcuts.map((sc) => {
                const keysList = isMac ? sc.keys.mac : sc.keys.win;
                const isMatched = matchedShortcutId === sc.id;

                return (
                  <div
                    key={sc.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
                      isMatched
                        ? 'bg-indigo-500/15 border-indigo-500 shadow-md shadow-indigo-500/20 scale-[1.01]'
                        : isDark
                          ? 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-1.5">
                          {sc.popular && (
                            <span className="p-0.5 rounded bg-amber-500/20 text-amber-400" title="Popular Hotkey">
                              <Flame className="w-3 h-3" />
                            </span>
                          )}
                          <h3 className={`text-xs font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {sc.title}
                          </h3>
                        </div>

                        {/* Keys Badge */}
                        <div className="flex items-center space-x-1 shrink-0">
                          {keysList.map((keyStr, idx) => (
                            <kbd
                              key={idx}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border shadow-xs transition-colors ${
                                isDark
                                  ? 'bg-slate-900 border-slate-700 text-indigo-300 shadow-slate-950'
                                  : 'bg-white border-slate-300 text-indigo-600 shadow-slate-200'
                              }`}
                            >
                              {keyStr}
                            </kbd>
                          ))}
                        </div>
                      </div>

                      <p className={`text-[11px] leading-relaxed mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {sc.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/40 flex items-center justify-between">
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Context: {sc.context}
                      </span>
                      {isMatched && (
                        <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 animate-in fade-in">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Match!</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono font-bold text-[10px] border border-indigo-500/20">
              PRO TIP
            </span>
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px] border border-slate-700">?</kbd> anytime to toggle this helper modal instantly.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Got it, close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
