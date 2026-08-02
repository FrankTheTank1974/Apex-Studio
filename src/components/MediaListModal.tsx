import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Download, 
  Copy, 
  Trash2, 
  Plus, 
  Check, 
  Upload, 
  Clock, 
  HardDrive, 
  Maximize2, 
  Code, 
  ExternalLink,
  Sparkles,
  Tag,
  SlidersHorizontal,
  FileCode,
  Radio,
  FileAudio,
  FileVideo,
  Eye
} from 'lucide-react';
import { ProjectFile, ThemeMode, IncludedMediaItem } from '../types';

interface MediaListModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: ProjectFile[];
  activeFileId: string;
  onUpdateFiles: (newFiles: ProjectFile[]) => void;
  onInsertMediaHtml?: (htmlSnippet: string) => void;
  themeMode: ThemeMode;
}

export const MediaListModal: React.FC<MediaListModalProps> = ({
  isOpen,
  onClose,
  files,
  activeFileId,
  onUpdateFiles,
  onInsertMediaHtml,
  themeMode,
}) => {
  const isDark = themeMode === 'dark';

  // Filters & Search State
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio' | 'svg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'size-desc' | 'size-asc' | 'name-asc'>('date-desc');

  // Active playing audio state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, { current: number; duration: number }>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Lightbox Preview State
  const [lightboxItem, setLightboxItem] = useState<IncludedMediaItem | null>(null);

  // Copy Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  // Add URL Form Modal State
  const [isAddUrlOpen, setIsAddUrlOpen] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | 'audio'>('image');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper to format byte sizes
  const formatBytes = (bytes: number): string => {
    if (bytes <= 0 || isNaN(bytes)) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper to format timestamps
  const formatDate = (timestamp: number): string => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to format audio duration in M:SS
  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Extract all included media from files (Assets + Embedded HTML/CSS media)
  const [mediaList, setMediaList] = useState<IncludedMediaItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const items: IncludedMediaItem[] = [];
    const seenSrcs = new Set<string>();

    files.forEach((file) => {
      const fileLastModified = file.lastModified || Date.now();

      // 1. Check Asset Files directly
      if (file.type === 'asset' || file.mediaType) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        let type: 'image' | 'video' | 'audio' | 'svg' = 'image';
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) type = 'video';
        else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) type = 'audio';
        else if (ext === 'svg' || file.content.trim().startsWith('<svg')) type = 'svg';

        const sizeBytes = file.size || Math.round(file.content.length * 0.75);

        items.push({
          id: `file-${file.id}`,
          name: file.name,
          type,
          src: file.content,
          origin: `Asset: ${file.path}`,
          sizeBytes,
          sizeFormatted: formatBytes(sizeBytes),
          timestamp: fileLastModified,
          dateFormatted: formatDate(fileLastModified),
          isAssetFile: true,
          fileId: file.id,
        });
        seenSrcs.add(file.content);
      }

      // 2. Parse HTML Content for Images, Videos, Audio, and SVGs
      if (file.type === 'html') {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(file.content, 'text/html');

          // Parse <img> tags
          doc.querySelectorAll('img').forEach((img, idx) => {
            const src = img.getAttribute('src');
            if (src && !seenSrcs.has(src)) {
              seenSrcs.add(src);
              const alt = img.getAttribute('alt') || '';
              const title = img.getAttribute('title') || alt || `Image #${idx + 1}`;
              const sizeEst = src.startsWith('data:') ? Math.round(src.length * 0.75) : 45000;

              items.push({
                id: `img-${file.id}-${idx}`,
                name: title || `image-${idx + 1}.png`,
                type: 'image',
                src,
                origin: file.name,
                sizeBytes: sizeEst,
                sizeFormatted: formatBytes(sizeEst),
                timestamp: fileLastModified - idx * 1000,
                dateFormatted: formatDate(fileLastModified - idx * 1000),
                altText: alt,
              });
            }
          });

          // Parse <video> tags
          doc.querySelectorAll('video').forEach((video, idx) => {
            let src = video.getAttribute('src');
            if (!src) {
              const source = video.querySelector('source');
              src = source?.getAttribute('src') || null;
            }
            if (src && !seenSrcs.has(src)) {
              seenSrcs.add(src);
              const sizeEst = src.startsWith('data:') ? Math.round(src.length * 0.75) : 2500000;
              items.push({
                id: `video-${file.id}-${idx}`,
                name: video.getAttribute('title') || `video-${idx + 1}.mp4`,
                type: 'video',
                src,
                origin: file.name,
                sizeBytes: sizeEst,
                sizeFormatted: formatBytes(sizeEst),
                timestamp: fileLastModified - idx * 1200,
                dateFormatted: formatDate(fileLastModified - idx * 1200),
              });
            }
          });

          // Parse <audio> tags
          doc.querySelectorAll('audio').forEach((audio, idx) => {
            let src = audio.getAttribute('src');
            if (!src) {
              const source = audio.querySelector('source');
              src = source?.getAttribute('src') || null;
            }
            if (src && !seenSrcs.has(src)) {
              seenSrcs.add(src);
              const sizeEst = src.startsWith('data:') ? Math.round(src.length * 0.75) : 1200000;
              items.push({
                id: `audio-${file.id}-${idx}`,
                name: audio.getAttribute('title') || `audio-track-${idx + 1}.mp3`,
                type: 'audio',
                src,
                origin: file.name,
                sizeBytes: sizeEst,
                sizeFormatted: formatBytes(sizeEst),
                timestamp: fileLastModified - idx * 1500,
                dateFormatted: formatDate(fileLastModified - idx * 1500),
              });
            }
          });

          // Parse inline <svg> graphics
          doc.querySelectorAll('svg').forEach((svg, idx) => {
            const svgContent = svg.outerHTML;
            if (svgContent && !seenSrcs.has(svgContent)) {
              seenSrcs.add(svgContent);
              const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
              const sizeEst = new Blob([svgContent]).size;
              items.push({
                id: `svg-${file.id}-${idx}`,
                name: svg.getAttribute('id') || `inline-vector-${idx + 1}.svg`,
                type: 'svg',
                src: svgDataUrl,
                origin: file.name,
                sizeBytes: sizeEst,
                sizeFormatted: formatBytes(sizeEst),
                timestamp: fileLastModified - idx * 800,
                dateFormatted: formatDate(fileLastModified - idx * 800),
              });
            }
          });
        } catch (e) {
          console.warn('Error parsing HTML for media:', e);
        }
      }

      // 3. Parse CSS Content for url(...) images
      if (file.type === 'css') {
        const urlMatches = file.content.match(/url\(['"]?([^'")] logic?)['"]?\)/g);
        const urlRegex = /url\(['"]?([^'"]+)['"]?\)/g;
        let match;
        let idx = 0;
        while ((match = urlRegex.exec(file.content)) !== null) {
          const url = match[1];
          if (url && !url.startsWith('data:font') && !seenSrcs.has(url)) {
            seenSrcs.add(url);
            idx++;
            const sizeEst = url.startsWith('data:') ? Math.round(url.length * 0.75) : 38000;
            items.push({
              id: `css-media-${file.id}-${idx}`,
              name: `css-background-${idx}.png`,
              type: 'image',
              src: url,
              origin: file.name,
              sizeBytes: sizeEst,
              sizeFormatted: formatBytes(sizeEst),
              timestamp: fileLastModified - idx * 500,
              dateFormatted: formatDate(fileLastModified - idx * 500),
            });
          }
        }
      }
    });

    setMediaList(items);
  }, [files, isOpen]);

  // Audio Playback Handlers
  const handleToggleAudioPlay = (id: string, src: string) => {
    if (playingAudioId === id) {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.pause();
      }
      setPlayingAudioId(null);
    } else {
      // Pause any currently playing audio
      if (playingAudioId && audioRefs.current[playingAudioId]) {
        audioRefs.current[playingAudioId]?.pause();
      }

      let audio = audioRefs.current[id];
      if (!audio) {
        audio = new Audio(src);
        audioRefs.current[id] = audio;

        audio.addEventListener('timeupdate', () => {
          setAudioProgress((prev) => ({
            ...prev,
            [id]: { current: audio?.currentTime || 0, duration: audio?.duration || 0 },
          }));
        });

        audio.addEventListener('ended', () => {
          setPlayingAudioId(null);
        });
      }

      audio.play().then(() => {
        setPlayingAudioId(id);
      }).catch((err) => {
        console.warn('Audio play error:', err);
      });
    }
  };

  // Upload Local Files Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const newProjectFiles: ProjectFile[] = [...files];

    Array.from(uploadedFiles).forEach((file: File) => {
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let mediaType: 'image' | 'video' | 'audio' | 'svg' = 'image';
      if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) mediaType = 'video';
      else if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) mediaType = 'audio';
      else if (ext === 'svg') mediaType = 'svg';

      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (!content) return;

        const assetFile: ProjectFile = {
          id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          type: 'asset',
          content,
          path: `/assets/${file.name}`,
          size: file.size,
          lastModified: file.lastModified || Date.now(),
          mediaType,
        };

        newProjectFiles.push(assetFile);
        onUpdateFiles([...newProjectFiles]);
      };

      if (ext === 'svg' || file.type === 'image/svg+xml') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add Media by External URL Handler
  const handleAddMediaUrl = () => {
    if (!newMediaUrl.trim()) return;

    const name = newMediaName.trim() || `external-${newMediaType}-${Date.now()}`;
    const ext = newMediaType === 'image' ? 'png' : newMediaType === 'video' ? 'mp4' : 'mp3';
    const fileName = name.includes('.') ? name : `${name}.${ext}`;

    const newAsset: ProjectFile = {
      id: `asset-${Date.now()}`,
      name: fileName,
      type: 'asset',
      content: newMediaUrl.trim(),
      path: `/assets/${fileName}`,
      size: 150000,
      lastModified: Date.now(),
      mediaType: newMediaType,
    };

    onUpdateFiles([...files, newAsset]);
    setNewMediaUrl('');
    setNewMediaName('');
    setIsAddUrlOpen(false);
  };

  // Copy HTML Tag Handler
  const handleCopyTag = (item: IncludedMediaItem) => {
    let tag = `<img src="${item.src}" alt="${item.name}" class="max-w-full h-auto rounded-lg" />`;
    if (item.type === 'video') {
      tag = `<video controls src="${item.src}" class="w-full rounded-lg shadow-md"></video>`;
    } else if (item.type === 'audio') {
      tag = `<audio controls src="${item.src}" class="w-full"></audio>`;
    } else if (item.type === 'svg' && item.src.startsWith('data:image/svg+xml;utf8,')) {
      tag = decodeURIComponent(item.src.replace('data:image/svg+xml;utf8,', ''));
    }

    navigator.clipboard.writeText(tag);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Insert into Active HTML File Handler
  const handleInsertIntoHtml = (item: IncludedMediaItem) => {
    let tag = `<img src="${item.src}" alt="${item.name}" class="max-w-full h-auto rounded-lg my-4" />`;
    if (item.type === 'video') {
      tag = `<video controls src="${item.src}" class="w-full rounded-lg shadow-md my-4"></video>`;
    } else if (item.type === 'audio') {
      tag = `<audio controls src="${item.src}" class="w-full my-4"></audio>`;
    }

    if (onInsertMediaHtml) {
      onInsertMediaHtml(tag);
    } else {
      // Direct insertion into active HTML file
      const updated = files.map((f) => {
        if (f.id === activeFileId || f.type === 'html') {
          const closingBodyIndex = f.content.lastIndexOf('</body>');
          if (closingBodyIndex !== -1) {
            const newContent =
              f.content.substring(0, closingBodyIndex) +
              `  ${tag}\n` +
              f.content.substring(closingBodyIndex);
            return { ...f, content: newContent };
          }
          return { ...f, content: f.content + `\n${tag}` };
        }
        return f;
      });
      onUpdateFiles(updated);
    }

    setInsertedId(item.id);
    setTimeout(() => setInsertedId(null), 2000);
  };

  // Delete Media Handler
  const handleDeleteMedia = (item: IncludedMediaItem) => {
    if (item.isAssetFile && item.fileId) {
      onUpdateFiles(files.filter((f) => f.id !== item.fileId));
    } else {
      setMediaList((prev) => prev.filter((m) => m.id !== item.id));
    }
  };

  // Filter & Sort Logic
  const filteredMedia = mediaList
    .filter((item) => {
      if (filterType === 'image' && item.type !== 'image') return false;
      if (filterType === 'video' && item.type !== 'video') return false;
      if (filterType === 'audio' && item.type !== 'audio') return false;
      if (filterType === 'svg' && item.type !== 'svg') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.origin.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          (item.altText && item.altText.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return b.timestamp - a.timestamp;
      if (sortBy === 'date-asc') return a.timestamp - b.timestamp;
      if (sortBy === 'size-desc') return b.sizeBytes - a.sizeBytes;
      if (sortBy === 'size-asc') return a.sizeBytes - b.sizeBytes;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

  // Count metrics
  const counts = {
    all: mediaList.length,
    image: mediaList.filter((m) => m.type === 'image').length,
    video: mediaList.filter((m) => m.type === 'video').length,
    audio: mediaList.filter((m) => m.type === 'audio').length,
    svg: mediaList.filter((m) => m.type === 'svg').length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className={`w-full max-w-5xl h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold tracking-tight">Included Media Directory</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {counts.all} Total Files
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                All pictures, videos, audio tracks, and vector graphics embedded in HTML/CSS and project assets
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Upload Files Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,video/*,audio/*,.svg"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
              title="Upload images, videos, audio or SVG files to project assets"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Media</span>
            </button>

            {/* Add Media via URL */}
            <button
              onClick={() => setIsAddUrlOpen(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add URL</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className={`p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'
        }`}>
          {/* Category Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All ({counts.all})</span>
            </button>

            <button
              onClick={() => setFilterType('image')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'image'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pictures ({counts.image})</span>
            </button>

            <button
              onClick={() => setFilterType('video')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'video'
                  ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>Videos ({counts.video})</span>
            </button>

            <button
              onClick={() => setFilterType('audio')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'audio'
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>Audio ({counts.audio})</span>
            </button>

            <button
              onClick={() => setFilterType('svg')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'svg'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>SVGs ({counts.svg})</span>
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center space-x-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search media by title or path..."
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-white placeholder-slate-500'
                    : 'bg-white border-slate-300 focus:border-purple-500 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className={`px-3 py-1.5 text-xs rounded-xl border outline-none cursor-pointer transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-300 text-slate-800'
              }`}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="size-desc">Largest Size</option>
              <option value="size-asc">Smallest Size</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Media Grid Display Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {filteredMedia.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
                <Film className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-base font-bold mb-1">No included media found</h3>
              <p className={`text-xs max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {searchQuery
                  ? `No media matches "${searchQuery}". Try clearing your filter or searching for another term.`
                  : 'Upload images, videos or audio files to your project using the "Upload Media" button above.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredMedia.map((item) => {
                const isPlaying = playingAudioId === item.id;
                const progress = audioProgress[item.id] || { current: 0, duration: 0 };

                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-2xl border transition-all flex flex-col overflow-hidden ${
                      isDark
                        ? 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-950/20'
                        : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg'
                    }`}
                  >
                    {/* Media Thumbnail Container */}
                    <div className="relative h-40 w-full bg-slate-900 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
                      {/* PICTURES / IMAGES / SVGs */}
                      {(item.type === 'image' || item.type === 'svg') && (
                        <div
                          onClick={() => setLightboxItem(item)}
                          className="w-full h-full flex items-center justify-center p-2 cursor-pointer group/img"
                        >
                          <img
                            src={item.src}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover/img:scale-105"
                            onError={(e) => {
                              // Fallback image indicator if broken URL
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full flex items-center space-x-1 shadow-md">
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>Enlarge</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* VIDEOS */}
                      {item.type === 'video' && (
                        <div className="relative w-full h-full bg-black group/vid">
                          <video
                            src={item.src}
                            muted
                            preload="metadata"
                            className="w-full h-full object-cover opacity-80 group-hover/vid:opacity-100 transition-opacity"
                          />
                          <div
                            onClick={() => setLightboxItem(item)}
                            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 group-hover/vid:bg-black/10 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform group-hover/vid:scale-110 transition-transform">
                              <Play className="w-6 h-6 ml-1 fill-white" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-mono rounded">
                            Video
                          </span>
                        </div>
                      )}

                      {/* AUDIO TRACKS */}
                      {item.type === 'audio' && (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                              <FileAudio className="w-3 h-3" />
                              <span>Audio File</span>
                            </span>
                            {progress.duration > 0 && (
                              <span className="text-[11px] font-mono text-amber-300/80">
                                {formatDuration(progress.duration)}
                              </span>
                            )}
                          </div>

                          {/* Interactive Audio Soundwave & Play Button */}
                          <div className="flex items-center space-x-3 my-auto">
                            <button
                              onClick={() => handleToggleAudioPlay(item.id, item.src)}
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                                isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-amber-600 hover:bg-amber-500'
                              }`}
                              title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                            >
                              {isPlaying ? (
                                <Pause className="w-5 h-5 fill-white" />
                              ) : (
                                <Play className="w-5 h-5 ml-0.5 fill-white" />
                              )}
                            </button>

                            {/* Audio Wave Bar Animation */}
                            <div className="flex-1 flex items-center space-x-1 h-8">
                              {[40, 70, 30, 90, 50, 80, 20, 60, 100, 40, 75, 30].map((h, i) => (
                                <div
                                  key={i}
                                  style={{ height: `${isPlaying ? Math.max(15, Math.floor(h * Math.random())) : h * 0.4}%` }}
                                  className={`flex-1 rounded-full transition-all duration-200 ${
                                    isPlaying ? 'bg-amber-400' : 'bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Progress Line */}
                          {progress.duration > 0 && (
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${(progress.current / progress.duration) * 100}%` }}
                                className="h-full bg-amber-400 transition-all duration-100"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Type Badge Header Overlay */}
                      <div className="absolute top-2.5 left-2.5 pointer-events-none">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md uppercase tracking-wider backdrop-blur-md ${
                          item.type === 'image'
                            ? 'bg-indigo-600/90 text-white'
                            : item.type === 'video'
                            ? 'bg-rose-600/90 text-white'
                            : item.type === 'audio'
                            ? 'bg-amber-600/90 text-white'
                            : 'bg-emerald-600/90 text-white'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                    </div>

                    {/* Media Item Info Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {/* Title & Origin */}
                        <h4 className="text-xs font-bold truncate tracking-tight mb-1" title={item.name}>
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 truncate">
                          <Tag className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{item.origin}</span>
                        </div>
                      </div>

                      {/* Metadata Row: File Size & Date */}
                      <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                        isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
                      }`}>
                        <div className="flex items-center space-x-1" title="File Size">
                          <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-semibold text-slate-300">{item.sizeFormatted}</span>
                        </div>

                        <div className="flex items-center space-x-1" title="Date Added / Modified">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.dateFormatted}</span>
                        </div>
                      </div>

                      {/* Action Toolbar */}
                      <div className="pt-2 flex items-center gap-1.5">
                        {/* Copy HTML Tag */}
                        <button
                          onClick={() => handleCopyTag(item)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                            copiedId === item.id
                              ? 'bg-emerald-600 text-white'
                              : isDark
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                          title="Copy ready-to-use HTML tag for this media"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Copy Tag</span>
                            </>
                          )}
                        </button>

                        {/* Insert into HTML */}
                        <button
                          onClick={() => handleInsertIntoHtml(item)}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                            insertedId === item.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40'
                          }`}
                          title="Insert this media tag directly into active HTML document"
                        >
                          {insertedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-purple-400" />
                          )}
                          <span className="hidden sm:inline">Insert</span>
                        </button>

                        {/* Download File */}
                        <a
                          href={item.src}
                          download={item.name}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                          title="Download Media File"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        {/* Delete Media */}
                        <button
                          onClick={() => handleDeleteMedia(item)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                          title="Remove media asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX ENLARGED MEDIA PREVIEW MODAL */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-full border border-slate-700"
            >
              <X className="w-6 h-6" />
            </button>

            {lightboxItem.type === 'video' ? (
              <video
                src={lightboxItem.src}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl border border-slate-800"
              />
            ) : (
              <img
                src={lightboxItem.src}
                alt={lightboxItem.name}
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
              />
            )}

            <div className="mt-4 text-center text-white">
              <h3 className="text-base font-bold">{lightboxItem.name}</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {lightboxItem.sizeFormatted} • Added {lightboxItem.dateFormatted} • {lightboxItem.origin}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXTERNAL MEDIA URL MODAL */}
      {isAddUrlOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Link External Media URL</span>
              </h3>
              <button onClick={() => setIsAddUrlOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Media Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMediaType('image')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 ${
                      newMediaType === 'image' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Picture</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMediaType('video')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 ${
                      newMediaType === 'video' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMediaType('audio')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 ${
                      newMediaType === 'audio' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Audio</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Media Title / Name</label>
                <input
                  type="text"
                  value={newMediaName}
                  onChange={(e) => setNewMediaName(e.target.value)}
                  placeholder="e.g. hero-background.png or ambient-music.mp3"
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Direct Media URL</label>
                <input
                  type="url"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddUrlOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMediaUrl}
                disabled={!newMediaUrl.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Add to Media List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
