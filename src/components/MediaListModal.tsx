import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  Image as ImageIcon, 
  Film, 
  Music, 
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
  Sparkles, 
  Tag, 
  SlidersHorizontal, 
  FileAudio, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wand2, 
  ShieldCheck, 
  RotateCw, 
  Filter, 
  Info,
  CheckSquare,
  FileText,
  Zap,
  Crop
} from 'lucide-react';
import { ProjectFile, ThemeMode, IncludedMediaItem, SmartAssetMetadata } from '../types';
import { ImageOptimizationModal } from './ImageOptimizationModal';

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

  // Navigation Tab State: 'directory' | 'smart-assets'
  const [activeTab, setActiveTab] = useState<'directory' | 'smart-assets'>('smart-assets');

  // Filters & Search State (Directory View)
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio' | 'svg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'size-desc' | 'size-asc' | 'name-asc'>('date-desc');

  // Smart Assets View Filters & State
  const [smartSearchQuery, setSmartSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [smartAccFilter, setSmartAccFilter] = useState<'all' | 'missing' | 'compliant' | 'suggestions'>('all');

  // AI Metadata Map: Keyed by item.id
  const [smartMetadataMap, setSmartMetadataMap] = useState<Record<string, SmartAssetMetadata>>({});
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  // Inline Editable Alt Texts State
  const [editingAltMap, setEditingAltMap] = useState<Record<string, string>>({});
  const [newTagInputMap, setNewTagInputMap] = useState<Record<string, string>>({});

  // Active playing audio state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<Record<string, { current: number; duration: number }>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Lightbox Preview & Image Optimizer Modal State
  const [lightboxItem, setLightboxItem] = useState<IncludedMediaItem | null>(null);
  const [optimizingItem, setOptimizingItem] = useState<IncludedMediaItem | null>(null);

  // Copy & Action Feedback State
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);
  const [appliedAltId, setAppliedAltId] = useState<string | null>(null);

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

    // Initialize smart metadata for items with initial heuristic tags
    setSmartMetadataMap((prev) => {
      const updated = { ...prev };
      items.forEach((item) => {
        if (!updated[item.id] && (item.type === 'image' || item.type === 'svg')) {
          const isSvg = item.type === 'svg';
          const cleanName = item.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          const defaultTags = isSvg
            ? ['Vector Graphic', 'Scalable', 'SVG', 'UI Element']
            : ['Image Asset', cleanName, 'Web Media'];
          
          const initialAlt = item.altText || '';
          const hasAlt = Boolean(initialAlt.trim());

          updated[item.id] = {
            tags: defaultTags,
            suggestedAltText: hasAlt ? initialAlt : `Descriptive image representing ${cleanName}`,
            category: isSvg ? 'Icon/Vector' : 'UI Component',
            accessibilityStatus: hasAlt ? 'compliant' : 'missing',
            accessibilityTip: hasAlt ? 'Alt text is configured.' : 'Add alt text to satisfy WCAG 2.1 screen reader compliance.',
            analyzedAt: 0,
          };
        }
      });
      return updated;
    });
  }, [files, isOpen]);

  // AI Single Image Analysis Handler
  const analyzeSingleItemWithAI = async (item: IncludedMediaItem) => {
    setAnalyzingIds((prev) => new Set(prev).add(item.id));

    try {
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: item.src,
          imageName: item.name,
          currentAltText: item.altText || editingAltMap[item.id] || '',
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setSmartMetadataMap((prev) => ({
          ...prev,
          [item.id]: {
            tags: resData.data.tags || ['Image Asset'],
            suggestedAltText: resData.data.suggestedAltText || `Illustration representing ${item.name}`,
            category: resData.data.category || 'UI Component',
            accessibilityStatus: resData.data.accessibilityStatus || 'needs-improvement',
            accessibilityTip: resData.data.accessibilityTip || 'Concise WCAG compliant alt text.',
            analyzedAt: Date.now(),
          },
        }));

        // Prefill editing alt map if empty
        if (!editingAltMap[item.id] && !item.altText) {
          setEditingAltMap((prev) => ({
            ...prev,
            [item.id]: resData.data.suggestedAltText,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to analyze image with AI:', err);
    } finally {
      setAnalyzingIds((prev) => {
        const updated = new Set(prev);
        updated.delete(item.id);
        return updated;
      });
    }
  };

  // Batch Auto-Tag & Alt Text Generation for All Imported Images
  const handleBatchAutoTagAll = async () => {
    const imagesToAnalyze = mediaList.filter((m) => m.type === 'image' || m.type === 'svg');
    if (imagesToAnalyze.length === 0) return;

    setIsBatchAnalyzing(true);
    setBatchProgress({ current: 0, total: imagesToAnalyze.length });

    for (let i = 0; i < imagesToAnalyze.length; i++) {
      const item = imagesToAnalyze[i];
      setBatchProgress({ current: i + 1, total: imagesToAnalyze.length });
      await analyzeSingleItemWithAI(item);
    }

    setIsBatchAnalyzing(false);
  };

  // Apply Alt Text directly to Project HTML Files
  const handleApplyAltText = (item: IncludedMediaItem, altValue: string) => {
    const finalAlt = altValue.trim();
    if (!finalAlt) return;

    // 1. Update local media list
    setMediaList((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, altText: finalAlt } : m))
    );

    // 2. Update smart metadata map status to 'compliant'
    setSmartMetadataMap((prev) => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        suggestedAltText: finalAlt,
        accessibilityStatus: 'compliant',
        accessibilityTip: '✓ WCAG 2.1 descriptive alt text verified.',
      },
    }));

    // 3. Find and replace alt attributes in project HTML files
    const updatedFiles = files.map((file) => {
      if (file.type === 'html') {
        let content = file.content;
        const srcAttr = item.src;

        // Escape regex special chars
        const escapedSrc = srcAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Regex matching <img ... src="escapedSrc" ...>
        const imgRegex = new RegExp(`<img([^>]*?)src=["']${escapedSrc}["']([^>]*?)>`, 'gi');

        if (imgRegex.test(content)) {
          content = content.replace(imgRegex, (match, p1, p2) => {
            // Check if alt attribute already exists in tag
            if (/alt=["'][^"']*["']/i.test(match)) {
              return match.replace(/alt=["'][^"']*["']/i, `alt="${finalAlt}"`);
            } else {
              return `<img${p1}src="${srcAttr}" alt="${finalAlt}"${p2}>`;
            }
          });
          return { ...file, content };
        }
      }
      return file;
    });

    onUpdateFiles(updatedFiles);

    setAppliedAltId(item.id);
    setTimeout(() => setAppliedAltId(null), 2500);
  };

  // Tag Management
  const handleAddCustomTag = (itemId: string) => {
    const inputVal = (newTagInputMap[itemId] || '').trim();
    if (!inputVal) return;

    setSmartMetadataMap((prev) => {
      const currentMeta = prev[itemId] || { tags: [] };
      const currentTags = currentMeta.tags || [];
      if (currentTags.includes(inputVal)) return prev;

      return {
        ...prev,
        [itemId]: {
          ...currentMeta,
          tags: [...currentTags, inputVal],
        },
      };
    });

    setNewTagInputMap((prev) => ({ ...prev, [itemId]: '' }));
  };

  const handleRemoveTag = (itemId: string, tagToRemove: string) => {
    setSmartMetadataMap((prev) => {
      const currentMeta = prev[itemId];
      if (!currentMeta) return prev;
      return {
        ...prev,
        [itemId]: {
          ...currentMeta,
          tags: (currentMeta.tags || []).filter((t) => t !== tagToRemove),
        },
      };
    });
  };

  // Audio Playback Handlers
  const handleToggleAudioPlay = (id: string, src: string) => {
    if (playingAudioId === id) {
      const audio = audioRefs.current[id];
      if (audio) {
        audio.pause();
      }
      setPlayingAudioId(null);
    } else {
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
    const meta = smartMetadataMap[item.id];
    const alt = item.altText || meta?.suggestedAltText || item.name;
    let tag = `<img src="${item.src}" alt="${alt}" class="max-w-full h-auto rounded-lg" />`;
    
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
    const meta = smartMetadataMap[item.id];
    const alt = item.altText || meta?.suggestedAltText || item.name;
    let tag = `<img src="${item.src}" alt="${alt}" class="max-w-full h-auto rounded-lg my-4" />`;
    
    if (item.type === 'video') {
      tag = `<video controls src="${item.src}" class="w-full rounded-lg shadow-md my-4"></video>`;
    } else if (item.type === 'audio') {
      tag = `<audio controls src="${item.src}" class="w-full my-4"></audio>`;
    }

    if (onInsertMediaHtml) {
      onInsertMediaHtml(tag);
    } else {
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

  // Filter & Sort Logic (Directory View)
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

  // Filter Logic for Smart Assets Tab (Images + SVGs)
  const imageAssetsList = mediaList.filter((m) => m.type === 'image' || m.type === 'svg');

  const filteredSmartAssets = imageAssetsList.filter((item) => {
    const meta = smartMetadataMap[item.id];

    // Accessibility filter
    if (smartAccFilter === 'missing') {
      if (item.altText && item.altText.trim()) return false;
    } else if (smartAccFilter === 'compliant') {
      if (!item.altText || !item.altText.trim()) return false;
    } else if (smartAccFilter === 'suggestions') {
      if (!meta?.suggestedAltText) return false;
    }

    // Selected Tag Filter
    if (selectedTagFilter) {
      const tags = meta?.tags || [];
      if (!tags.includes(selectedTagFilter)) return false;
    }

    // Search query
    if (smartSearchQuery.trim()) {
      const q = smartSearchQuery.toLowerCase();
      const tagsStr = (meta?.tags || []).join(' ').toLowerCase();
      const altStr = (item.altText || meta?.suggestedAltText || '').toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.origin.toLowerCase().includes(q) ||
        tagsStr.includes(q) ||
        altStr.includes(q)
      );
    }

    return true;
  });

  // Collect All Unique Tags & Counts
  const tagCounts: Record<string, number> = {};
  imageAssetsList.forEach((item) => {
    const meta = smartMetadataMap[item.id];
    if (meta?.tags) {
      meta.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  const allUniqueTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Overall Accessibility Score Calculation
  const totalImageCount = imageAssetsList.length;
  const compliantCount = imageAssetsList.filter((m) => Boolean(m.altText && m.altText.trim())).length;
  const missingAltCount = totalImageCount - compliantCount;
  const accScorePercent = totalImageCount > 0 ? Math.round((compliantCount / totalImageCount) * 100) : 100;

  // Directory Counts
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
        {/* Modal Main Header */}
        <div className={`px-6 py-3.5 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            
            {/* View Mode Navigation Tabs */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/80 border-slate-300'
            }`}>
              <button
                onClick={() => setActiveTab('smart-assets')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'smart-assets'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-200" />
                <span>Smart Assets AI</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-400/30 text-purple-100 font-mono">
                  {imageAssetsList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('directory')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'directory'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Media Directory</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-400/30 text-indigo-100 font-mono">
                  {counts.all}
                </span>
              </button>
            </div>
          </div>

          {/* Top Right Action Tools */}
          <div className="flex items-center space-x-2.5">
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
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
              title="Upload images, videos, audio or SVG files to project assets"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Asset</span>
            </button>

            {/* Add Media via URL */}
            <button
              onClick={() => setIsAddUrlOpen(true)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Link URL</span>
            </button>

            {/* Image Optimizer Studio Launcher */}
            <button
              onClick={() => {
                const firstImg = mediaList.find((m) => m.type === 'image' || m.type === 'svg');
                if (firstImg) {
                  setOptimizingItem(firstImg);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              title="Resize, crop & compress images (WebP/JPEG/PNG) before canvas insertion"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-200 fill-white" />
              <span>Image Optimizer</span>
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

        {/* TAB 1: SMART ASSETS AI HUB */}
        {activeTab === 'smart-assets' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* AI Banner & WCAG Accessibility Audit Dashboard */}
            <div className={`p-5 border-b ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/80'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                
                {/* AI Feature Intro & Batch Trigger */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span>AI Vision & Accessibility Engine</span>
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold tracking-tight">
                    Smart Image Auto-Tagging & WCAG Alt-Text Compliance
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Automatically generate descriptive image tags, categorize visual assets, and enforce WCAG 2.1 accessibility compliance with one-click alt text application to your HTML documents.
                  </p>
                </div>

                {/* Accessibility Health Meter & Action Button */}
                <div className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
                  {/* Score Card */}
                  <div className={`p-3 rounded-2xl border flex items-center space-x-3 flex-1 sm:flex-initial ${
                    isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                      accScorePercent >= 80
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : accScorePercent >= 50
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {accScorePercent}%
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold">WCAG Compliance</span>
                      </div>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {compliantCount} of {totalImageCount} images configured
                      </p>
                    </div>
                  </div>

                  {/* Batch Auto-Tag Button */}
                  <button
                    onClick={handleBatchAutoTagAll}
                    disabled={isBatchAnalyzing || totalImageCount === 0}
                    className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
                  >
                    {isBatchAnalyzing ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin text-purple-200" />
                        <span>Analyzing {batchProgress.current}/{batchProgress.total}...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 text-purple-200" />
                        <span>Auto-Tag & Generate Alt Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Progress bar during batch analysis */}
              {isBatchAnalyzing && (
                <div className="mt-4 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300"
                  />
                </div>
              )}
            </div>

            {/* Smart Toolbar & Tag Cloud */}
            <div className={`px-5 py-3 border-b flex flex-col md:flex-row items-center justify-between gap-3 ${
              isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-100 bg-slate-50/50'
            }`}>
              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={smartSearchQuery}
                  onChange={(e) => setSmartSearchQuery(e.target.value)}
                  placeholder="Filter by keyword, AI tag, alt text..."
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 focus:border-purple-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Quick Filter Status Tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
                <button
                  onClick={() => setSmartAccFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    smartAccFilter === 'all'
                      ? 'bg-purple-600 text-white'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  All Images ({totalImageCount})
                </button>

                <button
                  onClick={() => setSmartAccFilter('missing')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    smartAccFilter === 'missing'
                      ? 'bg-rose-600 text-white'
                      : isDark ? 'bg-slate-800 text-rose-400 hover:bg-slate-700' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-rose-300" />
                  <span>Missing Alt Text ({missingAltCount})</span>
                </button>

                <button
                  onClick={() => setSmartAccFilter('compliant')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    smartAccFilter === 'compliant'
                      ? 'bg-emerald-600 text-white'
                      : isDark ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>WCAG Compliant ({compliantCount})</span>
                </button>
              </div>
            </div>

            {/* AI Tags Cloud Pills Bar */}
            {allUniqueTags.length > 0 && (
              <div className={`px-5 py-2.5 border-b flex items-center space-x-2 overflow-x-auto scrollbar-none ${
                isDark ? 'border-slate-800/60 bg-slate-950/60' : 'border-slate-100 bg-slate-100/50'
              }`}>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-purple-400" />
                  <span>AI Tags:</span>
                </span>

                {selectedTagFilter && (
                  <button
                    onClick={() => setSelectedTagFilter(null)}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1 shrink-0"
                  >
                    <span>Clear Filter: #{selectedTagFilter}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}

                {allUniqueTags.map((tag) => {
                  const isSelected = selectedTagFilter === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTagFilter(isSelected ? null : tag)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-400/50'
                          : isDark
                          ? 'bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-500/20'
                          : 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                      }`}
                    >
                      #{tag} <span className="opacity-60 text-[10px]">({tagCounts[tag]})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Smart Asset Grid Display */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {filteredSmartAssets.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-purple-400 mb-4">
                    <Sparkles className="w-8 h-8 opacity-60" />
                  </div>
                  <h3 className="text-base font-bold mb-1">No matching smart image assets</h3>
                  <p className={`text-xs max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {smartSearchQuery || selectedTagFilter
                      ? 'No images match your active filters or tag query. Try clearing your search filters.'
                      : 'Upload image or vector files to auto-tag keywords and optimize for WCAG accessibility.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredSmartAssets.map((item) => {
                    const meta = smartMetadataMap[item.id] || { tags: [] };
                    const isAnalyzing = analyzingIds.has(item.id);
                    const currentAlt = item.altText || '';
                    const editedAlt = editingAltMap[item.id] ?? currentAlt;
                    const hasAltConfigured = Boolean(currentAlt.trim());

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border transition-all flex flex-col overflow-hidden ${
                          isDark
                            ? 'bg-slate-950/80 border-slate-800 hover:border-purple-500/40 hover:shadow-xl'
                            : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg'
                        }`}
                      >
                        {/* Top Preview Header */}
                        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                              <ImageIcon className="w-4 h-4" />
                            </span>
                            <div className="truncate">
                              <h4 className="text-xs font-bold truncate text-white" title={item.name}>
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono">
                                {item.origin} • {item.sizeFormatted}
                              </p>
                            </div>
                          </div>

                          {/* WCAG Compliance Badge */}
                          <div className="shrink-0">
                            {hasAltConfigured ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>WCAG Compliant</span>
                              </span>
                            ) : meta.suggestedAltText ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                <span>Alt Suggestion</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
                                <XCircle className="w-3 h-3 text-rose-400" />
                                <span>Missing Alt</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle Container: Image & Details */}
                        <div className="p-4 flex flex-col md:flex-row gap-4">
                          {/* Thumbnail */}
                          <div
                            onClick={() => setLightboxItem(item)}
                            className="w-full md:w-36 h-32 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 relative group cursor-pointer shrink-0 overflow-hidden"
                          >
                            <img
                              src={item.src}
                              alt={currentAlt || item.name}
                              className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="w-4 h-4 text-white" />
                            </div>
                          </div>

                          {/* Alt Text & Tags Configuration */}
                          <div className="flex-1 space-y-3 min-w-0">
                            {/* Alt Text Box */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                                  <FileText className="w-3 h-3 text-indigo-400" />
                                  <span>Accessibility Alt Text (WCAG 2.1)</span>
                                </label>
                                {meta.suggestedAltText && (
                                  <button
                                    onClick={() =>
                                      setEditingAltMap((prev) => ({ ...prev, [item.id]: meta.suggestedAltText! }))
                                    }
                                    className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold underline"
                                  >
                                    Use AI Suggestion
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={editedAlt}
                                  onChange={(e) =>
                                    setEditingAltMap((prev) => ({ ...prev, [item.id]: e.target.value }))
                                  }
                                  placeholder="Describe image for screen readers..."
                                  className={`flex-1 px-3 py-1.5 text-xs rounded-xl border outline-none font-sans transition-all ${
                                    isDark
                                      ? 'bg-slate-900 border-slate-700 focus:border-purple-500 text-white'
                                      : 'bg-slate-50 border-slate-300 focus:border-purple-500 text-slate-900'
                                  }`}
                                />
                                <button
                                  onClick={() => handleApplyAltText(item, editedAlt)}
                                  disabled={!editedAlt.trim()}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center space-x-1 ${
                                    appliedAltId === item.id
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                                  }`}
                                  title="Update alt attribute in HTML files"
                                >
                                  {appliedAltId === item.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Applied!</span>
                                    </>
                                  ) : (
                                    <span>Apply</span>
                                  )}
                                </button>
                              </div>

                              {/* AI Alt Suggestion Banner */}
                              {meta.suggestedAltText && meta.suggestedAltText !== currentAlt && (
                                <p className="text-[11px] text-purple-300/90 mt-1 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                                  <span className="font-bold">AI Suggestion:</span> "{meta.suggestedAltText}"
                                </p>
                              )}
                            </div>

                            {/* AI Auto-Tags */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center space-x-1">
                                <Tag className="w-3 h-3 text-purple-400" />
                                <span>Auto-Generated Keywords & Tags</span>
                              </label>

                              <div className="flex flex-wrap items-center gap-1.5">
                                {(meta.tags || []).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center space-x-1 group/tag"
                                  >
                                    <span>#{tag}</span>
                                    <button
                                      onClick={() => handleRemoveTag(item.id, tag)}
                                      className="text-purple-400 hover:text-rose-400 opacity-60 group-hover/tag:opacity-100"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}

                                {/* Add Tag Inline */}
                                <div className="flex items-center space-x-1">
                                  <input
                                    type="text"
                                    value={newTagInputMap[item.id] || ''}
                                    onChange={(e) =>
                                      setNewTagInputMap((prev) => ({ ...prev, [item.id]: e.target.value }))
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleAddCustomTag(item.id);
                                    }}
                                    placeholder="+ Tag"
                                    className={`w-16 px-1.5 py-0.5 text-[10px] rounded-md border outline-none ${
                                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer Action Controls */}
                        <div className={`p-2.5 border-t flex items-center justify-between gap-2 ${
                          isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-100 bg-slate-50'
                        }`}>
                          <button
                            onClick={() => analyzeSingleItemWithAI(item)}
                            disabled={isAnalyzing}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                              isDark ? 'bg-slate-800 hover:bg-slate-700 text-purple-300' : 'bg-purple-50 hover:bg-purple-100 text-purple-800'
                            }`}
                          >
                            {isAnalyzing ? (
                              <RotateCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                            ) : (
                              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                            )}
                            <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze AI'}</span>
                          </button>

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => setOptimizingItem(item)}
                              className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                              title="Resize, crop, and compress image before canvas insertion"
                            >
                              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
                              <span>Optimize</span>
                            </button>

                            <button
                              onClick={() => handleCopyTag(item)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                                copiedId === item.id
                                  ? 'bg-emerald-600 text-white'
                                  : isDark
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                              }`}
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                              <span>Copy Tag</span>
                            </button>

                            <button
                              onClick={() => handleInsertIntoHtml(item)}
                              className="px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-purple-400" />
                              <span>Insert</span>
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
        )}

        {/* TAB 2: DIRECTORY GRID VIEW */}
        {activeTab === 'directory' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Directory Toolbar */}
            <div className={`p-4 border-b flex flex-col md:flex-row items-center justify-between gap-3 ${
              isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'
            }`}>
              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>All ({counts.all})</span>
                </button>

                <button
                  onClick={() => setFilterType('image')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'image'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Pictures ({counts.image})</span>
                </button>

                <button
                  onClick={() => setFilterType('video')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'video'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-rose-400" />
                  <span>Videos ({counts.video})</span>
                </button>

                <button
                  onClick={() => setFilterType('audio')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'audio'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audio ({counts.audio})</span>
                </button>

                <button
                  onClick={() => setFilterType('svg')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterType === 'svg'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SVGs ({counts.svg})</span>
                </button>
              </div>

              {/* Search & Sort */}
              <div className="flex items-center space-x-2.5 w-full md:w-auto">
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

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {filteredMedia.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
                    <Film className="w-8 h-8 opacity-50" />
                  </div>
                  <h3 className="text-base font-bold mb-1">No media files found</h3>
                  <p className={`text-xs max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Upload images, videos, audio or SVG files to your project using the "Upload Asset" button above.
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
                            ? 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50 hover:shadow-xl'
                            : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg'
                        }`}
                      >
                        {/* Media Thumbnail Container */}
                        <div className="relative h-40 w-full bg-slate-900 flex items-center justify-center overflow-hidden border-b border-slate-800/80">
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
                            </div>
                          )}

                          {item.type === 'audio' && (
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 p-4 flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                                  <FileAudio className="w-3 h-3" />
                                  <span>Audio Track</span>
                                </span>
                              </div>

                              <div className="flex items-center space-x-3 my-auto">
                                <button
                                  onClick={() => handleToggleAudioPlay(item.id, item.src)}
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 cursor-pointer ${
                                    isPlaying ? 'bg-amber-500 animate-pulse' : 'bg-amber-600 hover:bg-amber-500'
                                  }`}
                                >
                                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 ml-0.5 fill-white" />}
                                </button>
                                <div className="flex-1 flex items-center space-x-1 h-8">
                                  {[40, 70, 30, 90, 50, 80, 20, 60, 100, 40, 75, 30].map((h, i) => (
                                    <div
                                      key={i}
                                      style={{ height: `${isPlaying ? Math.max(15, Math.floor(h * Math.random())) : h * 0.4}%` }}
                                      className={`flex-1 rounded-full transition-all duration-200 ${isPlaying ? 'bg-amber-400' : 'bg-slate-700'}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="absolute top-2.5 left-2.5 pointer-events-none">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md uppercase tracking-wider backdrop-blur-md ${
                              item.type === 'image' ? 'bg-indigo-600/90 text-white' : item.type === 'video' ? 'bg-rose-600/90 text-white' : item.type === 'audio' ? 'bg-amber-600/90 text-white' : 'bg-emerald-600/90 text-white'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h4 className="text-xs font-bold truncate tracking-tight mb-1" title={item.name}>
                              {item.name}
                            </h4>
                            <div className="flex items-center space-x-1 text-[11px] text-slate-400 truncate">
                              <Tag className="w-3 h-3 text-purple-400 shrink-0" />
                              <span className="truncate">{item.origin}</span>
                            </div>
                          </div>

                          <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
                          }`}>
                            <div className="flex items-center space-x-1">
                              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="font-semibold text-slate-300">{item.sizeFormatted}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>{item.dateFormatted}</span>
                            </div>
                          </div>

                          {/* Toolbar */}
                          <div className="pt-2 flex items-center gap-1.5">
                            {(item.type === 'image' || item.type === 'svg') && (
                              <button
                                onClick={() => setOptimizingItem(item)}
                                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 cursor-pointer transition-all"
                                title="Resize, crop & compress image (WebP/JPEG)"
                              >
                                <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />
                              </button>
                            )}

                            <button
                              onClick={() => handleCopyTag(item)}
                              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                                copiedId === item.id ? 'bg-emerald-600 text-white' : isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                              }`}
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                              <span>Copy Tag</span>
                            </button>

                            <button
                              onClick={() => handleInsertIntoHtml(item)}
                              className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-purple-400" />
                              <span className="hidden sm:inline">Insert</span>
                            </button>

                            <a
                              href={item.src}
                              download={item.name}
                              target="_blank"
                              rel="noreferrer"
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                              }`}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDeleteMedia(item)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer"
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
        )}
      </div>

      {/* LIGHTBOX PREVIEW MODAL */}
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
              className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-full border border-slate-700 cursor-pointer"
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
                alt={lightboxItem.altText || lightboxItem.name}
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
              <button onClick={() => setIsAddUrlOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
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
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 cursor-pointer ${
                      newMediaType === 'image' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Picture</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMediaType('video')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 cursor-pointer ${
                      newMediaType === 'video' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMediaType('audio')}
                    className={`p-2 rounded-xl border flex items-center justify-center space-x-1.5 cursor-pointer ${
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
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMediaUrl}
                disabled={!newMediaUrl.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer"
              >
                Add to Media List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE OPTIMIZATION & COMPRESSION STUDIO MODAL */}
      <ImageOptimizationModal
        isOpen={Boolean(optimizingItem)}
        onClose={() => setOptimizingItem(null)}
        item={optimizingItem}
        files={files}
        onUpdateFiles={onUpdateFiles}
        onInsertMediaHtml={onInsertMediaHtml}
        themeMode={themeMode}
      />
    </div>
  );
};
