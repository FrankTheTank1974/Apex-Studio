import React, { useState, useEffect, useMemo } from 'react';
import { ProjectFile } from '../types';
import { 
  History, 
  RotateCcw, 
  Bookmark, 
  Clock, 
  FileText, 
  Check, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  Plus, 
  Eye, 
  HardDrive,
  Download,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export interface ProjectVersionSnapshot {
  id: string;
  timestamp: number;
  dateFormatted: string;
  timeFormatted: string;
  label: string;
  description?: string;
  files: ProjectFile[];
  isManual?: boolean;
  totalSizeBytes: number;
}

interface VersionHistoryPanelProps {
  files: ProjectFile[];
  onRestoreFiles: (restoredFiles: ProjectFile[]) => void;
  isDark?: boolean;
}

const STORAGE_KEY = 'apex_project_version_history';

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  files,
  onRestoreFiles,
  isDark = true
}) => {
  // Load initial snapshots from localStorage or create initial snapshot
  const [snapshots, setSnapshots] = useState<ProjectVersionSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // Default initial snapshot
    const now = new Date();
    const size = files.reduce((acc, f) => acc + (f.content ? f.content.length : 0), 0);
    return [
      {
        id: `ver-init-${now.getTime()}`,
        timestamp: now.getTime(),
        dateFormatted: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timeFormatted: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        label: 'Initial Project Snapshot',
        description: 'Auto-created when project initialized',
        files: JSON.parse(JSON.stringify(files)),
        isManual: true,
        totalSizeBytes: size
      }
    ];
  });

  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>(null);
  const [expandedSnapshotId, setExpandedSnapshotId] = useState<string | null>(null);
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [isCreatingCheckpoint, setIsCreatingCheckpoint] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Save snapshots to localStorage whenever snapshots state updates
  useEffect(() => {
    try {
      // Limit saved snapshots to max 25 to keep localStorage light
      const trimmed = snapshots.slice(0, 25);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.warn('Could not persist version history to localStorage:', err);
    }
  }, [snapshots]);

  // Automatically take periodic snapshots when files change (debounced)
  useEffect(() => {
    if (!files || files.length === 0) return;

    const timer = setTimeout(() => {
      // Check if current files match the latest snapshot
      const latest = snapshots[0];
      if (latest) {
        const latestJson = JSON.stringify(latest.files);
        const currentJson = JSON.stringify(files);
        if (latestJson === currentJson) return; // No change
      }

      // Create auto save snapshot
      const now = new Date();
      const totalSize = files.reduce((acc, f) => acc + (f.content ? f.content.length : 0), 0);
      const newSnap: ProjectVersionSnapshot = {
        id: `ver-auto-${now.getTime()}`,
        timestamp: now.getTime(),
        dateFormatted: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        timeFormatted: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        label: 'Auto Save',
        description: `Modified project files (${files.length} files)`,
        files: JSON.parse(JSON.stringify(files)),
        isManual: false,
        totalSizeBytes: totalSize
      };

      setSnapshots((prev) => [newSnap, ...prev].slice(0, 30));
    }, 2500); // 2.5s debounce

    return () => clearTimeout(timer);
  }, [files]);

  // Create explicit manual checkpoint
  const handleCreateManualCheckpoint = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const label = newCheckpointName.trim() || 'Manual Saved Checkpoint';
    const now = new Date();
    const totalSize = files.reduce((acc, f) => acc + (f.content ? f.content.length : 0), 0);

    const newSnap: ProjectVersionSnapshot = {
      id: `ver-manual-${now.getTime()}`,
      timestamp: now.getTime(),
      dateFormatted: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timeFormatted: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      label,
      description: `User-saved version checkpoint`,
      files: JSON.parse(JSON.stringify(files)),
      isManual: true,
      totalSizeBytes: totalSize
    };

    setSnapshots((prev) => [newSnap, ...prev]);
    setActiveSnapshotId(newSnap.id);
    setNewCheckpointName('');
    setIsCreatingCheckpoint(false);
    setNotification(`Saved checkpoint: "${label}"`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Restore project to a specific version snapshot
  const handleRestoreSnapshot = (snap: ProjectVersionSnapshot) => {
    // Clone files to prevent mutation reference issues
    const restored = JSON.parse(JSON.stringify(snap.files));
    onRestoreFiles(restored);
    setActiveSnapshotId(snap.id);
    setNotification(`Restored project state from ${snap.timeFormatted} (${snap.label})`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Delete a specific snapshot
  const handleDeleteSnapshot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
    if (expandedSnapshotId === id) setExpandedSnapshotId(null);
  };

  // Clear all version history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all version history snapshots?')) {
      setSnapshots([]);
      localStorage.removeItem(STORAGE_KEY);
      setNotification('Version history cleared');
      setTimeout(() => setNotification(null), 2500);
    }
  };

  // Format file size
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Header Banner */}
      <div className={`p-3 rounded-xl border flex items-center justify-between ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="font-bold text-xs text-indigo-400 flex items-center space-x-1.5">
              <span>Version History</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-500/20 text-indigo-300 font-mono">
                {snapshots.length} {snapshots.length === 1 ? 'Snapshot' : 'Snapshots'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Automatic saves & restore points
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingCheckpoint(!isCreatingCheckpoint)}
          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Point</span>
        </button>
      </div>

      {notification && (
        <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center space-x-2 animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{notification}</span>
        </div>
      )}

      {/* Manual Checkpoint Form */}
      {isCreatingCheckpoint && (
        <form 
          onSubmit={handleCreateManualCheckpoint}
          className={`p-3 rounded-xl border space-y-2 animate-fade-in ${
            isDark ? 'bg-slate-950 border-indigo-500/50' : 'bg-indigo-50/50 border-indigo-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
            <span className="flex items-center space-x-1">
              <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
              <span>Name Version Checkpoint</span>
            </span>
            <button
              type="button"
              onClick={() => setIsCreatingCheckpoint(false)}
              className="text-slate-400 hover:text-white text-[10px]"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            value={newCheckpointName}
            onChange={(e) => setNewCheckpointName(e.target.value)}
            placeholder="e.g. Major UI Redesign, Added Navigation..."
            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-medium focus:outline-none focus:border-indigo-500 ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg transition-all shadow-md cursor-pointer"
          >
            Create Named Save Point
          </button>
        </form>
      )}

      {/* Snapshots List Timeline */}
      {snapshots.length === 0 ? (
        <div className={`p-6 text-center rounded-xl border ${
          isDark ? 'bg-slate-950/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-xs">No version history yet</p>
          <p className="text-[10px] text-slate-500 mt-1">
            Edit files on canvas or code editor to generate automatic save points.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {snapshots.map((snap, idx) => {
            const isExpanded = expandedSnapshotId === snap.id;
            const isActive = activeSnapshotId === snap.id || (idx === 0 && !activeSnapshotId);

            return (
              <div
                key={snap.id}
                className={`rounded-xl border transition-all ${
                  isActive
                    ? isDark
                      ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30'
                      : 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-300'
                    : isDark
                      ? 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {/* Snapshot Header Row */}
                <div 
                  className="p-3 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedSnapshotId(isExpanded ? null : snap.id)}
                >
                  <div className="flex items-start space-x-2.5">
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                      snap.isManual 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {snap.isManual ? <Bookmark className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-200 truncate max-w-[150px]">
                          {snap.label}
                        </span>
                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                            Active State
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{snap.timeFormatted}</span>
                        <span>•</span>
                        <span>{snap.dateFormatted}</span>
                        <span>•</span>
                        <span>{formatBytes(snap.totalSizeBytes)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {/* Restore Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreSnapshot(snap);
                      }}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                      title="Restore project files to this state"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>

                    {/* Expand Details Toggle */}
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800/50"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className={`px-3 pb-3 pt-1 border-t space-y-2 animate-fade-in ${
                    isDark ? 'border-slate-800/80 bg-slate-950/80' : 'border-slate-200 bg-slate-100/50'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Saved Files in Snapshot ({snap.files.length})</span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSnapshot(snap.id, e)}
                        className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-sans cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Version</span>
                      </button>
                    </div>

                    {/* File Pills List */}
                    <div className="grid grid-cols-1 gap-1.5">
                      {snap.files.map((file) => {
                        const isSelectedFile = previewFileId === `${snap.id}-${file.id}`;
                        return (
                          <div key={file.id} className="space-y-1">
                            <button
                              type="button"
                              onClick={() => setPreviewFileId(isSelectedFile ? null : `${snap.id}-${file.id}`)}
                              className={`w-full p-1.5 rounded-lg border text-left flex items-center justify-between text-[11px] font-mono transition-colors ${
                                isSelectedFile
                                  ? 'bg-slate-800 border-indigo-500/50 text-indigo-200'
                                  : isDark
                                    ? 'bg-slate-900 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center space-x-1.5 truncate">
                                <FileText className="w-3 h-3 text-indigo-400 shrink-0" />
                                <span className="truncate">{file.name}</span>
                              </div>
                              <span className="text-[9px] text-slate-500 font-sans">
                                {file.content ? `${file.content.length} chars` : '0 chars'}
                              </span>
                            </button>

                            {/* File Content Preview */}
                            {isSelectedFile && (
                              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-indigo-200 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap select-all">
                                {file.content || '/* Empty File */'}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Utility Actions */}
      <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
        isDark ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'
      }`}>
        <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
          <HardDrive className="w-3 h-3 text-slate-400" />
          <span>Local Persistence Active</span>
        </span>

        {snapshots.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="text-[10px] text-slate-400 hover:text-rose-400 font-semibold transition-colors cursor-pointer"
          >
            Clear History
          </button>
        )}
      </div>
    </div>
  );
};
