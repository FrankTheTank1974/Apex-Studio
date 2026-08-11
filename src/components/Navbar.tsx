import React from 'react';
import { 
  Eye, 
  Code, 
  Columns, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Download, 
  CloudUpload, 
  Users, 
  Sparkles, 
  Workflow, 
  FolderArchive,
  Play,
  Share2,
  FolderPlus,
  Sun,
  Moon,
  Type,
  Undo2,
  Redo2,
  Keyboard,
  Globe,
  Film,
  Link as LinkIcon,
  Search,
  Smile,
  Database,
  ShieldAlert
} from 'lucide-react';
import { ViewMode, DeviceMode, ProjectFile, ThemeMode } from '../types';

interface NavbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onOpenExport: () => void;
  onOpenAI: () => void;
  aiEnabled?: boolean;
  onOpenDrawIo: () => void;
  onOpenFonts?: () => void;
  onOpenShortcuts?: () => void;
  onOpenHostedPreview?: () => void;
  onOpenImportUrl?: () => void;
  onOpenMedia?: () => void;
  onOpenQuickLinkModal?: () => void;
  onOpenSEOModal?: () => void;
  onOpenIconPicker?: () => void;
  onOpenSqlDb?: () => void;
  onOpenNewProject: () => void;
  onExportZst: () => void;
  activeRoomId: string | null;
  onToggleCollab: () => void;
  collaboratorCount: number;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projectName,
  onProjectNameChange,
  viewMode,
  onViewModeChange,
  deviceMode,
  onDeviceModeChange,
  themeMode,
  onToggleTheme,
  onOpenExport,
  onOpenAI,
  aiEnabled = true,
  onOpenDrawIo,
  onOpenFonts,
  onOpenShortcuts,
  onOpenHostedPreview,
  onOpenImportUrl,
  onOpenMedia,
  onOpenQuickLinkModal,
  onOpenSEOModal,
  onOpenIconPicker,
  onOpenSqlDb,
  onOpenNewProject,
  onExportZst,
  activeRoomId,
  onToggleCollab,
  collaboratorCount,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  const isDark = themeMode === 'dark';

  return (
    <header className={`flex flex-col select-none z-30 transition-colors shrink-0 ${
      isDark ? 'bg-slate-900 text-slate-200 border-slate-800' : 'bg-white text-slate-800 border-slate-200'
    }`}>
      {/* Tier 1: Primary Header Bar */}
      <div className="h-12 border-b px-4 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
        {/* Brand & Project Name */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-500/20">
              A
            </div>
            <span className={`font-bold tracking-tight text-base hidden sm:inline ${isDark ? 'text-white' : 'text-slate-900'}`}>ApexStudio</span>
          </div>
          
          <span className={`${isDark ? 'text-slate-700' : 'text-slate-300'} hidden sm:inline`}>|</span>

          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className={`font-medium text-xs px-2 py-1 rounded border outline-none transition-colors w-28 sm:w-36 ${
                isDark 
                  ? 'bg-transparent hover:bg-slate-800 focus:bg-slate-800 text-white border-transparent focus:border-indigo-500'
                  : 'bg-transparent hover:bg-slate-100 focus:bg-slate-100 text-slate-900 border-transparent focus:border-indigo-500'
              }`}
              placeholder="Project Title"
            />

            {/* New Project Button */}
            <button
              onClick={onOpenNewProject}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all shadow-2xs ${
                isDark
                  ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
              title="Start a New Project with starter template"
            >
              <FolderPlus className="w-3 h-3 text-indigo-500" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
        </div>

        {/* View Mode & Device Mode Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Undo / Redo History Controls */}
          <div className={`p-0.5 rounded-lg border flex items-center space-x-0.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
          }`}>
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1 rounded text-xs transition-colors flex items-center ${
                canUndo
                  ? isDark
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white cursor-pointer shadow-2xs'
                  : isDark ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-400 opacity-40 cursor-not-allowed'
              }`}
              title="Undo Canvas Action (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1 rounded text-xs transition-colors flex items-center ${
                canRedo
                  ? isDark
                    ? 'text-slate-200 hover:text-white hover:bg-slate-800 cursor-pointer'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white cursor-pointer shadow-2xs'
                  : isDark ? 'text-slate-600 opacity-40 cursor-not-allowed' : 'text-slate-400 opacity-40 cursor-not-allowed'
              }`}
              title="Redo Canvas Action (Ctrl+Y / Cmd+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex items-center space-x-0.5">
            <button
              onClick={() => onViewModeChange('wysiwyg')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                viewMode === 'wysiwyg'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Visual WYSIWYG Canvas"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Visual Canvas</span>
            </button>
            
            <button
              onClick={() => onViewModeChange('split')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                viewMode === 'split'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Split Visual & Code Mode"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split View</span>
            </button>

            <button
              onClick={() => onViewModeChange('code')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                viewMode === 'code'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Raw Code Editors (HTML, CSS, JS)"
            >
              <Code className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Code Editor</span>
            </button>

            <button
              onClick={() => onViewModeChange('preview')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Full Interactive Preview"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Live Preview</span>
            </button>
          </div>

          {/* Responsive Device Switcher (Visible in WYSIWYG / Split / Preview) */}
          {viewMode !== 'code' && (
            <div className="hidden lg:flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 items-center space-x-0.5">
              <button
                onClick={() => onDeviceModeChange('desktop')}
                className={`p-1 rounded text-xs transition-colors ${
                  deviceMode === 'desktop' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeviceModeChange('tablet')}
                className={`p-1 rounded text-xs transition-colors ${
                  deviceMode === 'tablet' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeviceModeChange('mobile')}
                className={`p-1 rounded text-xs transition-colors ${
                  deviceMode === 'mobile' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {/* AI Assistant Trigger */}
          {aiEnabled ? (
            <button
              onClick={onOpenAI}
              className="flex items-center space-x-1 px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[11px] font-semibold transition-all cursor-pointer"
              title="AI Design & Component Copilot (Ctrl+K)"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
          ) : (
            <div
              className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800/60 text-slate-400 border border-slate-700/60 rounded-md text-[11px] font-medium opacity-75 cursor-not-allowed select-none"
              title="AI Copilot is disabled by corporate/enterprise policy (--disable-ai)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">AI Disabled</span>
            </div>
          )}

          {/* Theme Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-300 shadow-2xs'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>

          {/* Cloud Deployment Hub Trigger */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md text-xs shadow-xs shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Deploy</span>
          </button>
        </div>
      </div>

      {/* Tier 2: Quick Tools & Integrations Ribbon (Scrollable horizontally) */}
      <div className={`px-4 py-1 border-b flex items-center space-x-3 overflow-x-auto whitespace-nowrap custom-scrollbar text-xs shrink-0 ${
        isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        {/* Category: DATABASE */}
        {onOpenSqlDb && (
          <div className="flex items-center space-x-1 pr-2 border-r border-slate-800/60">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mr-1">Data:</span>
            <button
              onClick={onOpenSqlDb}
              className="flex items-center space-x-1 px-2 py-0.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="Inspect MySQL / PostgreSQL schemas, query database tables, and view charts"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>SQL Studio</span>
            </button>
          </div>
        )}

        {/* Category: DESIGN & MEDIA */}
        <div className="flex items-center space-x-1 pr-2 border-r border-slate-800/60">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mr-1">Design:</span>
          {onOpenIconPicker && (
            <button
              onClick={onOpenIconPicker}
              className="flex items-center space-x-1 px-2 py-0.5 bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="Browse & insert Lucide / FontAwesome icons"
            >
              <Smile className="w-3 h-3 text-pink-400" />
              <span>Icons</span>
            </button>
          )}

          {onOpenFonts && (
            <button
              onClick={onOpenFonts}
              className="flex items-center space-x-1 px-2 py-0.5 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="Browse & Apply Google Fonts"
            >
              <Type className="w-3 h-3 text-indigo-400" />
              <span>Fonts</span>
            </button>
          )}

          {onOpenMedia && (
            <button
              onClick={onOpenMedia}
              className="flex items-center space-x-1 px-2 py-0.5 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="List & manage project media files"
            >
              <Film className="w-3 h-3 text-purple-400" />
              <span>Media</span>
            </button>
          )}

          <button
            onClick={onOpenDrawIo}
            className="flex items-center space-x-1 px-2 py-0.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
            title="Open Draw.io Diagram Editor"
          >
            <Workflow className="w-3 h-3 text-amber-400" />
            <span>Draw.io</span>
          </button>
        </div>

        {/* Category: WEB & SEO */}
        <div className="flex items-center space-x-1 pr-2 border-r border-slate-800/60">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mr-1">SEO & Links:</span>
          {onOpenSEOModal && (
            <button
              onClick={onOpenSEOModal}
              className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="Edit meta title, description, Open Graph & social tags"
            >
              <Search className="w-3 h-3 text-emerald-400" />
              <span>SEO Tags</span>
            </button>
          )}

          {onOpenQuickLinkModal && (
            <button
              onClick={onOpenQuickLinkModal}
              className="flex items-center space-x-1 px-2 py-0.5 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="Create external links or section anchors"
            >
              <LinkIcon className="w-3 h-3 text-cyan-400" />
              <span>+ Link</span>
            </button>
          )}

          {onOpenImportUrl && (
            <button
              onClick={onOpenImportUrl}
              className="flex items-center space-x-1 px-2 py-0.5 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="Directly import any webpage by URL"
            >
              <Globe className="w-3 h-3 text-teal-400" />
              <span>Import URL</span>
            </button>
          )}

          {onOpenHostedPreview && (
            <button
              onClick={onOpenHostedPreview}
              className="flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded text-[11px] font-semibold transition-all cursor-pointer"
              title="Preview hosted live view"
            >
              <Globe className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Hosted View</span>
            </button>
          )}
        </div>

        {/* Category: WORKSPACE & UTILITIES */}
        <div className="flex items-center space-x-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 mr-1">Workspace:</span>
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
              }`}
              title="Keyboard Shortcuts & IDE Hotkeys (?)"
            >
              <Keyboard className="w-3 h-3 text-indigo-400" />
              <span>Hotkeys</span>
            </button>
          )}

          <button
            onClick={onToggleCollab}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all cursor-pointer ${
              activeRoomId
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Real-time Multi-User Collaboration"
          >
            <Users className="w-3 h-3" />
            <span>{activeRoomId ? `Live (${collaboratorCount})` : 'Collab'}</span>
          </button>

          <button
            onClick={onExportZst}
            className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-medium transition-all cursor-pointer"
            title="Export complete project as .tar.zst archive"
          >
            <FolderArchive className="w-3 h-3 text-cyan-400" />
            <span>.tar.zst</span>
          </button>
        </div>
      </div>
    </header>
  );
};
