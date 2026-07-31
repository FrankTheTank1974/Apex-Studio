import React, { useState, useEffect } from 'react';
import { 
  X, 
  HardDrive, 
  Search, 
  Upload, 
  FolderPlus, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  FileText, 
  Image as ImageIcon, 
  Folder, 
  FileCode, 
  CheckCircle2, 
  AlertCircle,
  CloudUpload,
  LogOut
} from 'lucide-react';
import { 
  initDriveAuth, 
  googleSignIn, 
  logoutDrive, 
  fetchDriveFiles, 
  uploadFileToDrive, 
  createDriveFolder, 
  deleteFileFromDrive, 
  DriveFileItem 
} from '../utils/googleDrive';
import { ProjectFile } from '../types';

interface GoogleDriveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  files: ProjectFile[];
  themeMode: 'light' | 'dark';
}

export const GoogleDriveManagerModal: React.FC<GoogleDriveManagerModalProps> = ({
  isOpen,
  onClose,
  projectName,
  files,
  themeMode
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isExportingProject, setIsExportingProject] = useState(false);

  const isDark = themeMode === 'dark';

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initDriveAuth(
      (currentUser) => {
        setIsAuthenticated(true);
        setUser(currentUser);
        loadFiles();
      },
      () => {
        setIsAuthenticated(false);
        setUser(null);
        setDriveFiles([]);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  const loadFiles = async (query: string = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchDriveFiles(query);
      setDriveFiles(items);
    } catch (err: any) {
      console.error('Drive load error:', err);
      setError(err.message || 'Failed to connect to Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setIsAuthenticated(true);
        setUser(result.user);
        await loadFiles();
      }
    } catch (err: any) {
      setError(err.message || 'Google Drive authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logoutDrive();
    setIsAuthenticated(false);
    setUser(null);
    setDriveFiles([]);
    setSuccessMsg('Signed out of Google Drive.');
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await createDriveFolder(newFolderName.trim());
      setSuccessMsg(`Folder "${newFolderName}" created on Google Drive!`);
      setNewFolderName('');
      setIsCreatingFolder(false);
      await loadFiles();
    } catch (err: any) {
      setError(err.message || 'Could not create folder.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadLocalFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      for (let i = 0; i < fileList.length; i++) {
        await uploadFileToDrive(fileList[i]);
      }
      setSuccessMsg(`Uploaded ${fileList.length} file(s) to Google Drive.`);
      await loadFiles();
    } catch (err: any) {
      setError(err.message || 'File upload failed.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleExportCurrentProjectToDrive = async () => {
    setIsExportingProject(true);
    setError(null);
    try {
      // 1. Create a project folder on Drive
      const folder = await createDriveFolder(`${projectName} - ApexStudio`);

      // 2. Upload files into drive
      for (const f of files) {
        await uploadFileToDrive({
          name: f.name,
          content: f.content,
          mimeType: f.type === 'html' ? 'text/html' : f.type === 'css' ? 'text/css' : 'application/javascript',
        });
      }

      setSuccessMsg(`Exported project "${projectName}" to Google Drive folder!`);
      await loadFiles();
    } catch (err: any) {
      setError(err.message || 'Failed to export project to Google Drive.');
    } finally {
      setIsExportingProject(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    try {
      await deleteFileFromDrive(fileId, fileName);
      setSuccessMsg(`Deleted "${fileName}" from Google Drive.`);
      await loadFiles();
    } catch (err: any) {
      setError(err.message || 'Delete failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-5 px-6 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold flex items-center space-x-2">
                <span>Google Drive Cloud Integration</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Live Sync
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Access, upload, export, and organize real Google Drive files directly from ApexStudio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Messages */}
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button type="button" onClick={() => setSuccessMsg(null)} className="text-[10px] underline cursor-pointer">Dismiss</button>
            </div>
          )}

          {/* Unauthenticated View */}
          {!isAuthenticated ? (
            <div className={`p-8 text-center border rounded-2xl space-y-4 ${
              isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
                <HardDrive className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold">Connect your Google Account</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Grant access to browse, sync, upload, and export your web app files directly to your personal Google Drive.
                </p>
              </div>

              {/* Official Google Sign In Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={loading}
                  className="px-6 py-3 bg-white text-slate-800 hover:bg-slate-50 font-bold text-sm rounded-2xl border border-slate-300 shadow-md transition-all flex items-center space-x-3 cursor-pointer hover:scale-102 active:scale-98"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Connected User Bar & Actions */}
              <div className={`p-4 border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-blue-500/50" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {user?.displayName ? user.displayName.charAt(0) : 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold">{user?.displayName || 'Google Account'}</div>
                    <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleExportCurrentProjectToDrive}
                    disabled={isExportingProject}
                    className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                  >
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>{isExportingProject ? 'Exporting...' : 'Export Project to Drive'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center space-x-1 ${
                      isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>New Folder</span>
                  </button>

                  <label className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" multiple onChange={handleUploadLocalFile} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Folder Creation Input */}
              {isCreatingFolder && (
                <form onSubmit={handleCreateFolder} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name..."
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs border outline-hidden ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(false)}
                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              )}

              {/* Search Bar & Refresh */}
              <div className="flex items-center space-x-2">
                <div className={`flex-1 flex items-center px-3 py-2 border rounded-xl ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      loadFiles(e.target.value);
                    }}
                    placeholder="Search Google Drive files..."
                    className="w-full bg-transparent text-xs outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => loadFiles()}
                  disabled={loading}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Refresh Drive Files"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Drive File List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Google Drive Contents ({driveFiles.length})</span>
                  {loading && <span className="text-[10px] text-blue-400 animate-pulse">Syncing...</span>}
                </div>

                {driveFiles.length === 0 ? (
                  <div className={`p-8 text-center border rounded-2xl text-xs ${
                    isDark ? 'bg-slate-950/40 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    {loading ? 'Fetching files from Google Drive...' : 'No files found in your Google Drive.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                    {driveFiles.map((file) => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                      return (
                        <div
                          key={file.id}
                          className={`p-3 border rounded-xl transition-all flex items-center justify-between group ${
                            isDark ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                            <div className={`p-2 rounded-lg shrink-0 ${
                              isFolder 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : file.mimeType.includes('image')
                                ? 'bg-purple-500/10 text-purple-500'
                                : 'bg-blue-500/10 text-blue-500'
                            }`}>
                              {isFolder ? (
                                <Folder className="w-4 h-4" />
                              ) : file.mimeType.includes('image') ? (
                                <ImageIcon className="w-4 h-4" />
                              ) : file.mimeType.includes('html') || file.mimeType.includes('javascript') ? (
                                <FileCode className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate text-slate-200 dark:text-white" title={file.name}>
                                {file.name}
                              </p>
                              <p className={`text-[10px] truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {isFolder ? 'Folder' : file.size ? `${(parseInt(file.size) / 1024).toFixed(1)} KB` : 'Google Document'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
                                }`}
                                title="Open in Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteFile(file.id, file.name)}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                              title="Delete File (User Confirmation Required)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 px-6 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}>
          <span>Google Drive API • Connected via Firebase Auth</span>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-white' : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
