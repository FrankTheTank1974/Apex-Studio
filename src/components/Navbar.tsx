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
  Share2
} from 'lucide-react';
import { ViewMode, DeviceMode, ProjectFile } from '../types';

interface NavbarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onOpenExport: () => void;
  onOpenAI: () => void;
  onOpenDrawIo: () => void;
  onExportZst: () => void;
  activeRoomId: string | null;
  onToggleCollab: () => void;
  collaboratorCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  projectName,
  onProjectNameChange,
  viewMode,
  onViewModeChange,
  deviceMode,
  onDeviceModeChange,
  onOpenExport,
  onOpenAI,
  onOpenDrawIo,
  onExportZst,
  activeRoomId,
  onToggleCollab,
  collaboratorCount
}) => {
  return (
    <nav className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-slate-200 select-none z-30">
      {/* Brand & Project Name */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-indigo-500/20">
            A
          </div>
          <span className="font-bold tracking-tight text-white text-lg hidden sm:inline">ApexStudio</span>
        </div>
        
        <span className="text-slate-700 hidden sm:inline">|</span>

        <div className="flex items-center space-x-1">
          <input
            type="text"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="bg-transparent hover:bg-slate-800 focus:bg-slate-800 text-white font-medium text-sm px-2 py-1 rounded border border-transparent focus:border-indigo-500 outline-none transition-colors w-36 sm:w-48"
            placeholder="Project Title"
          />
        </div>
      </div>

      {/* View Mode & Device Mode Controls */}
      <div className="flex items-center space-x-4">
        {/* View Mode Switcher */}
        <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center space-x-1">
          <button
            onClick={() => onViewModeChange('wysiwyg')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === 'wysiwyg'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Visual WYSIWYG Canvas"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Visual Canvas</span>
          </button>
          
          <button
            onClick={() => onViewModeChange('split')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Split Visual & Code Mode"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Split View</span>
          </button>

          <button
            onClick={() => onViewModeChange('code')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === 'code'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Raw Code Editors (HTML, CSS, JS)"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Code Editor</span>
          </button>

          <button
            onClick={() => onViewModeChange('preview')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-emerald-600 text-white shadow-sm'
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
          <div className="hidden lg:flex bg-slate-950 p-1 rounded-lg border border-slate-800 items-center space-x-1">
            <button
              onClick={() => onDeviceModeChange('desktop')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'desktop' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeviceModeChange('tablet')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'tablet' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeviceModeChange('mobile')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'mobile' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Tools & Integration Buttons */}
      <div className="flex items-center space-x-2">
        {/* Draw.io Embedded Editor Trigger */}
        <button
          onClick={onOpenDrawIo}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-all"
          title="Open Draw.io Diagram Editor"
        >
          <Workflow className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Draw.io</span>
        </button>

        {/* AI Assistant Trigger */}
        <button
          onClick={onOpenAI}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-medium transition-all"
          title="AI Design & Component Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>

        {/* Real-time Collaboration Toggle */}
        <button
          onClick={onToggleCollab}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            activeRoomId
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Real-time Multi-User Collaboration"
        >
          <Users className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{activeRoomId ? `Live (${collaboratorCount})` : 'Collab'}</span>
        </button>

        {/* Download .tar.zst Archive Direct Button */}
        <button
          onClick={onExportZst}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all"
          title="Export complete project as .tar.zst Zstandard archive"
        >
          <FolderArchive className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">.tar.zst</span>
        </button>

        {/* Cloud Deployment Hub Trigger */}
        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs shadow-md shadow-indigo-600/30 transition-all"
        >
          <CloudUpload className="w-3.5 h-3.5" />
          <span>Deploy</span>
        </button>
      </div>
    </nav>
  );
};
