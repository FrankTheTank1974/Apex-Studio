import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sliders,
  Crop,
  Download,
  Check,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Plus,
  Save,
  RefreshCw,
  Layers,
  FileImage,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { IncludedMediaItem, ProjectFile, ThemeMode } from '../types';

interface ImageOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: IncludedMediaItem | null;
  files: ProjectFile[];
  onUpdateFiles: (newFiles: ProjectFile[]) => void;
  onInsertMediaHtml?: (htmlSnippet: string) => void;
  themeMode: ThemeMode;
}

export const ImageOptimizationModal: React.FC<ImageOptimizationModalProps> = ({
  isOpen,
  onClose,
  item,
  files,
  onUpdateFiles,
  onInsertMediaHtml,
  themeMode,
}) => {
  const isDark = themeMode === 'dark';

  // Image source and loading states
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  // Optimization Parameters
  const [selectedFormat, setSelectedFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [quality, setQuality] = useState<number>(0.82); // 0.10 to 1.00
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);

  // Crop & Transform Parameters
  const [aspectPreset, setAspectPreset] = useState<'free' | '1:1' | '16:9' | '4:3' | '9:16' | '3:2'>('free');
  // Crop rect values in percentages (0 to 100)
  const [cropRect, setCropRect] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Result state
  const [optimizedDataUrl, setOptimizedDataUrl] = useState<string>('');
  const [optimizedSizeBytes, setOptimizedSizeBytes] = useState<number>(0);
  const [originalSizeBytes, setOriginalSizeBytes] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Custom output filename state
  const [customFileName, setCustomFileName] = useState<string>('');

  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Helper format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes <= 0 || isNaN(bytes)) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Reset states when item or modal opens
  useEffect(() => {
    if (!isOpen || !item) return;

    setIsImageLoaded(false);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectPreset('free');
    setCropRect({ x: 0, y: 0, width: 100, height: 100 });
    setSelectedFormat('image/webp');
    setQuality(0.82);
    setSaveSuccessMsg(null);

    // Initial size estimation
    const estSize = item.sizeBytes || (item.src.startsWith('data:') ? Math.round(item.src.length * 0.75) : 150000);
    setOriginalSizeBytes(estSize);

    // Generate clean output filename
    const cleanBaseName = item.name.replace(/\.[^/.]+$/, '');
    setCustomFileName(`${cleanBaseName}-optimized.webp`);
  }, [isOpen, item]);

  // Update output filename extension when format changes
  useEffect(() => {
    if (!customFileName) return;
    const cleanBase = customFileName.replace(/\.(webp|jpg|jpeg|png)$/i, '');
    const ext = selectedFormat === 'image/webp' ? 'webp' : selectedFormat === 'image/jpeg' ? 'jpg' : 'png';
    setCustomFileName(`${cleanBase}.${ext}`);
  }, [selectedFormat]);

  // Handle Image Load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setNaturalWidth(w);
    setNaturalHeight(h);
    setTargetWidth(w);
    setTargetHeight(h);
    setIsImageLoaded(true);

    if (item?.src.startsWith('data:')) {
      const bSize = Math.round(item.src.length * 0.75);
      setOriginalSizeBytes(bSize);
    }
  };

  // Preset aspect ratio handler
  const applyAspectPreset = (preset: 'free' | '1:1' | '16:9' | '4:3' | '9:16' | '3:2') => {
    setAspectPreset(preset);
    if (!naturalWidth || !naturalHeight) return;

    if (preset === 'free') {
      setCropRect({ x: 0, y: 0, width: 100, height: 100 });
      return;
    }

    let targetRatio = 1;
    if (preset === '1:1') targetRatio = 1;
    else if (preset === '16:9') targetRatio = 16 / 9;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '9:16') targetRatio = 9 / 16;
    else if (preset === '3:2') targetRatio = 3 / 2;

    const imgRatio = naturalWidth / naturalHeight;

    let newWidthPct = 100;
    let newHeightPct = 100;

    if (imgRatio > targetRatio) {
      // Image is wider than target aspect ratio -> constrain width percentage
      newWidthPct = (targetRatio / imgRatio) * 100;
      newHeightPct = 100;
    } else {
      // Image is taller than target aspect ratio -> constrain height percentage
      newWidthPct = 100;
      newHeightPct = (imgRatio / targetRatio) * 100;
    }

    const x = Math.max(0, (100 - newWidthPct) / 2);
    const y = Math.max(0, (100 - newHeightPct) / 2);

    setCropRect({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(newWidthPct),
      height: Math.round(newHeightPct),
    });

    // Update target pixel width & height
    const croppedPxWidth = Math.round((newWidthPct / 100) * naturalWidth);
    const croppedPxHeight = Math.round((newHeightPct / 100) * naturalHeight);
    setTargetWidth(croppedPxWidth);
    setTargetHeight(croppedPxHeight);
  };

  // Target width change handler with aspect ratio lock
  const handleTargetWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspectRatio && naturalWidth > 0 && naturalHeight > 0) {
      const cropW = (cropRect.width / 100) * naturalWidth;
      const cropH = (cropRect.height / 100) * naturalHeight;
      const ratio = cropH > 0 ? cropW / cropH : 1;
      setTargetHeight(Math.round(val / ratio));
    }
  };

  // Target height change handler with aspect ratio lock
  const handleTargetHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspectRatio && naturalWidth > 0 && naturalHeight > 0) {
      const cropW = (cropRect.width / 100) * naturalWidth;
      const cropH = (cropRect.height / 100) * naturalHeight;
      const ratio = cropH > 0 ? cropW / cropH : 1;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  // Scale target preset button
  const applyScalePreset = (scalePct: number) => {
    if (!naturalWidth || !naturalHeight) return;
    const cropW = (cropRect.width / 100) * naturalWidth;
    const cropH = (cropRect.height / 100) * naturalHeight;
    setTargetWidth(Math.round(cropW * (scalePct / 100)));
    setTargetHeight(Math.round(cropH * (scalePct / 100)));
  };

  // Main Canvas Render & Compression Pipeline
  useEffect(() => {
    if (!isOpen || !isImageLoaded || !imgRef.current) return;

    setIsProcessing(true);

    const renderTimer = setTimeout(() => {
      try {
        const img = imgRef.current;
        if (!img) return;

        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;

        // Calculate source crop coordinates in pixels
        const cropX = Math.round((cropRect.x / 100) * srcW);
        const cropY = Math.round((cropRect.y / 100) * srcH);
        const cropW = Math.max(1, Math.round((cropRect.width / 100) * srcW));
        const cropH = Math.max(1, Math.round((cropRect.height / 100) * srcH));

        // Destination dimensions
        const destW = targetWidth > 0 ? targetWidth : cropW;
        const destH = targetHeight > 0 ? targetHeight : cropH;

        // Create offscreen canvas for rendering
        const canvas = document.createElement('canvas');
        canvas.width = destW;
        canvas.height = destH;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Handle background color for transparent images converted to JPEG
          if (selectedFormat === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, destW, destH);
          }

          ctx.save();
          ctx.translate(destW / 2, destH / 2);

          if (rotation !== 0) {
            ctx.rotate((rotation * Math.PI) / 180);
          }

          ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

          const is90Rotated = rotation === 90 || rotation === 270;
          const drawW = is90Rotated ? destH : destW;
          const drawH = is90Rotated ? destW : destH;

          ctx.drawImage(img, cropX, cropY, cropW, cropH, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          // Export compressed data URL
          const resultDataUrl = canvas.toDataURL(selectedFormat, quality);
          setOptimizedDataUrl(resultDataUrl);

          // Calculate output bytes
          const head = `data:${selectedFormat};base64,`;
          const base64Len = resultDataUrl.length - head.length;
          const byteLen = Math.round(base64Len * 0.75);
          setOptimizedSizeBytes(byteLen);
        }
      } catch (err) {
        console.error('Canvas image optimization error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 120);

    return () => clearTimeout(renderTimer);
  }, [
    isOpen,
    isImageLoaded,
    cropRect,
    targetWidth,
    targetHeight,
    selectedFormat,
    quality,
    rotation,
    flipH,
    flipV,
  ]);

  if (!isOpen || !item) return null;

  // Percentage reduction calculation
  const sizeDiff = originalSizeBytes - optimizedSizeBytes;
  const reductionPercent = originalSizeBytes > 0 ? Math.round((sizeDiff / originalSizeBytes) * 100) : 0;
  const isSmaller = sizeDiff >= 0;

  // Save as New Asset Action
  const handleSaveAsNewAsset = () => {
    if (!optimizedDataUrl) return;

    const fileName = customFileName.trim() || `optimized-${Date.now()}.${selectedFormat === 'image/webp' ? 'webp' : selectedFormat === 'image/jpeg' ? 'jpg' : 'png'}`;
    const newAsset: ProjectFile = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: fileName,
      type: 'asset',
      content: optimizedDataUrl,
      path: `/assets/${fileName}`,
      size: optimizedSizeBytes,
      lastModified: Date.now(),
      mediaType: 'image',
    };

    onUpdateFiles([...files, newAsset]);
    setSaveSuccessMsg(`Saved as new asset: ${fileName}`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Replace Existing Asset Action
  const handleReplaceExistingAsset = () => {
    if (!optimizedDataUrl || !item.isAssetFile || !item.fileId) return;

    const updated = files.map((f) => {
      if (f.id === item.fileId) {
        return {
          ...f,
          name: customFileName || f.name,
          content: optimizedDataUrl,
          size: optimizedSizeBytes,
          lastModified: Date.now(),
        };
      }
      return f;
    });

    onUpdateFiles(updated);
    setSaveSuccessMsg(`Replaced original asset file with WebP/Optimized image!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Insert Optimized Image into Active HTML Canvas
  const handleInsertIntoCanvas = () => {
    if (!optimizedDataUrl) return;

    const alt = item.altText || item.name;
    const tag = `<img src="${optimizedDataUrl}" alt="${alt}" width="${targetWidth}" height="${targetHeight}" class="max-w-full h-auto rounded-lg shadow-md my-4" />`;

    if (onInsertMediaHtml) {
      onInsertMediaHtml(tag);
    }

    setSaveSuccessMsg(`Inserted optimized image tag into Canvas HTML!`);
    setTimeout(() => {
      setSaveSuccessMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      {/* Hidden Image element used as canvas source */}
      <img
        ref={imgRef}
        src={item.src}
        alt={item.name}
        onLoad={handleImageLoad}
        className="hidden"
        crossOrigin="anonymous"
      />

      <div
        className={`w-full max-w-6xl h-[92vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-3.5 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                  Image Optimization & Compression Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  WebP / AVIF Ready
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Resize, crop, convert formats, and compress graphics before canvas placement.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT SIDEBAR: Controls & Settings Panel */}
          <div
            className={`w-full lg:w-96 border-r flex flex-col overflow-y-auto p-5 space-y-5 scrollbar-thin ${
              isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
            }`}
          >
            {/* 1. Format & Compression Quality */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                <span>Format & Compression</span>
              </label>

              {/* Format Select Pills */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('image/webp')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedFormat === 'image/webp'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs">WebP</span>
                  <span className="text-[9px] opacity-75">Next-Gen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('image/jpeg')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedFormat === 'image/jpeg'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs">JPEG</span>
                  <span className="text-[9px] opacity-75">Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('image/png')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedFormat === 'image/png'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs">PNG</span>
                  <span className="text-[9px] opacity-75">Lossless</span>
                </button>
              </div>

              {/* Quality Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Quality Factor:</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.00"
                  step="0.02"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Smallest (10%)</span>
                  <span>Balanced (80%)</span>
                  <span>Max (100%)</span>
                </div>
              </div>
            </div>

            <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

            {/* 2. Resize & Pixel Dimensions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Resize & Output Size</span>
                </label>

                {/* Aspect Lock Toggle */}
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                    lockAspectRatio
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {lockAspectRatio ? '✓ Aspect Ratio Locked' : 'Unlocked'}
                </button>
              </div>

              {/* Custom Width & Height Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Width (px)</label>
                  <input
                    type="number"
                    min="1"
                    value={targetWidth || ''}
                    onChange={(e) => handleTargetWidthChange(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Height (px)</label>
                  <input
                    type="number"
                    min="1"
                    value={targetHeight || ''}
                    onChange={(e) => handleTargetHeightChange(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border outline-none font-mono ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Scale Presets */}
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] text-slate-500 font-bold self-center mr-1">Scale:</span>
                {[100, 75, 50, 25].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => applyScalePreset(scale)}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {scale}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setTargetWidth(800);
                    if (lockAspectRatio && naturalWidth > 0) {
                      setTargetHeight(Math.round(800 / (naturalWidth / naturalHeight)));
                    }
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer"
                >
                  Web (800px)
                </button>
              </div>
            </div>

            <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

            {/* 3. Crop & Aspect Ratios */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Crop className="w-3.5 h-3.5 text-purple-400" />
                <span>Crop & Aspect Ratio</span>
              </label>

              {/* Aspect Ratio Presets */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'free', label: 'Free Crop' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '16:9', label: '16:9 HD' },
                  { id: '4:3', label: '4:3 Classic' },
                  { id: '9:16', label: '9:16 Story' },
                  { id: '3:2', label: '3:2 Photo' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyAspectPreset(preset.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      aspectPreset === preset.id
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : isDark
                        ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Sliders for manual crop rectangle positioning */}
              <div className="space-y-2 pt-1 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                    <span>Crop Width:</span>
                    <span className="font-mono">{cropRect.width}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cropRect.width}
                    onChange={(e) => {
                      const w = parseInt(e.target.value);
                      const x = Math.min(cropRect.x, 100 - w);
                      setCropRect((prev) => ({ ...prev, width: w, x }));
                    }}
                    className="w-full h-1 bg-slate-800 accent-purple-500 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                    <span>Crop Height:</span>
                    <span className="font-mono">{cropRect.height}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cropRect.height}
                    onChange={(e) => {
                      const h = parseInt(e.target.value);
                      const y = Math.min(cropRect.y, 100 - h);
                      setCropRect((prev) => ({ ...prev, height: h, y }));
                    }}
                    className="w-full h-1 bg-slate-800 accent-purple-500 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <hr className={isDark ? 'border-slate-800' : 'border-slate-200'} />

            {/* 4. Rotation & Flip */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Rotate & Transform</span>
              </label>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Rotate 90° Counter-Clockwise"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Rotate 90° Clockwise"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH(!flipH)}
                  className={`p-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    flipH ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Flip Horizontally"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV(!flipV)}
                  className={`p-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                    flipV ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Flip Vertically"
                >
                  <FlipVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reset All Settings Button */}
            <button
              type="button"
              onClick={() => {
                setRotation(0);
                setFlipH(false);
                setFlipV(false);
                setAspectPreset('free');
                setCropRect({ x: 0, y: 0, width: 100, height: 100 });
                setTargetWidth(naturalWidth);
                setTargetHeight(naturalHeight);
                setSelectedFormat('image/webp');
                setQuality(0.82);
              }}
              className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Parameters</span>
            </button>
          </div>

          {/* RIGHT VIEW: Live Preview & Compression Comparison */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-6 space-y-4">
            {/* Realtime Size Reduction Banner */}
            <div className="p-4 rounded-2xl border bg-slate-900/90 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm ${
                  isSmaller
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {isSmaller ? `-${reductionPercent}%` : `+${Math.abs(reductionPercent)}%`}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Optimization Savings
                    </span>
                    {isSmaller && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Saved {formatBytes(sizeDiff)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Original: <strong className="text-slate-200">{formatBytes(originalSizeBytes)}</strong> ({naturalWidth}x{naturalHeight}px)
                    <ArrowRight className="w-3 h-3 inline mx-1.5 text-emerald-400" />
                    Optimized: <strong className="text-emerald-300 font-bold">{formatBytes(optimizedSizeBytes)}</strong> ({targetWidth}x{targetHeight}px {selectedFormat.split('/')[1].toUpperCase()})
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              {isProcessing && (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold animate-pulse shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing...</span>
                </div>
              )}
            </div>

            {/* Visual Canvas Image Preview Stage */}
            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 relative flex items-center justify-center overflow-hidden min-h-[250px]">
              {optimizedDataUrl ? (
                <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
                  <img
                    src={optimizedDataUrl}
                    alt="Optimized preview"
                    className="max-h-[50vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-700/80"
                  />
                  {/* Subtle Crop Box Overlay */}
                  {cropRect.width < 100 || cropRect.height < 100 ? (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-purple-600/90 text-white text-[10px] font-bold backdrop-blur-md shadow-md flex items-center space-x-1">
                      <Crop className="w-3 h-3" />
                      <span>Cropped ({cropRect.width}% × {cropRect.height}%)</span>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 opacity-60" />
                  <p className="text-xs font-semibold">Generating optimized WebP preview...</p>
                </div>
              )}
            </div>

            {/* Custom File Name Input & Save Actions */}
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-3">
              {saveSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Filename Input */}
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Output File Name
                  </label>
                  <input
                    type="text"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center space-x-2 shrink-0 pt-2 sm:pt-0">
                  {/* Download Direct */}
                  <a
                    href={optimizedDataUrl}
                    download={customFileName || 'optimized-image.webp'}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                    title="Download optimized file directly"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download</span>
                  </a>

                  {/* Save as Asset */}
                  <button
                    onClick={handleSaveAsNewAsset}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Asset</span>
                  </button>

                  {/* Replace Original if it's an asset */}
                  {item.isAssetFile && (
                    <button
                      onClick={handleReplaceExistingAsset}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
                      title="Overwrite original project asset file with optimized version"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace Asset</span>
                    </button>
                  )}

                  {/* Insert Into Active Canvas */}
                  <button
                    onClick={handleInsertIntoCanvas}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Insert Canvas</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
