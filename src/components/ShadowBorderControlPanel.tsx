import React, { useState, useEffect, useMemo } from 'react';
import { SelectedElementInfo } from '../types';
import { 
  Box, 
  Sliders, 
  Check, 
  Copy, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Palette, 
  Layers, 
  Sun,
  ChevronDown,
  ChevronUp,
  CircleDot
} from 'lucide-react';

interface ShadowBorderControlPanelProps {
  selectedElement?: SelectedElementInfo | null;
  classList: string;
  onApplyClasses: (classesStr: string) => void;
  attributes: Record<string, string>;
  onUpdateAttribute: (key: string, value: string) => void;
  isDark?: boolean;
}

// Preset Box Shadows definition
const SHADOW_PRESETS = [
  { id: 'none', label: 'None', css: 'none', tw: 'shadow-none' },
  { id: 'sm', label: 'Soft Subtly', css: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', tw: 'shadow-sm' },
  { id: 'md', label: 'Medium Float', css: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', tw: 'shadow-md' },
  { id: 'lg', label: 'Elevated Card', css: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', tw: 'shadow-lg' },
  { id: 'xl', label: 'Deep Floating', css: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', tw: 'shadow-xl' },
  { id: '2xl', label: 'High Contrast', css: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', tw: 'shadow-2xl' },
  { id: 'glow-indigo', label: 'Indigo Glow', css: '0 10px 30px -5px rgba(99, 102, 241, 0.4)', tw: 'shadow-lg shadow-indigo-500/40' },
  { id: 'glow-cyan', label: 'Cyan Neon', css: '0 10px 30px -5px rgba(6, 182, 212, 0.4)', tw: 'shadow-lg shadow-cyan-500/40' },
  { id: 'glow-purple', label: 'Purple Aura', css: '0 10px 30px -5px rgba(168, 85, 247, 0.4)', tw: 'shadow-lg shadow-purple-500/40' },
  { id: 'inset-sm', label: 'Pressed Inset', css: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)', tw: 'shadow-inner' }
];

// Preset Border Radius options
const RADIUS_PRESETS = [
  { label: '0px', value: 0, tw: 'rounded-none' },
  { label: '4px', value: 4, tw: 'rounded-sm' },
  { label: '8px', value: 8, tw: 'rounded-md' },
  { label: '12px', value: 12, tw: 'rounded-lg' },
  { label: '16px', value: 16, tw: 'rounded-xl' },
  { label: '24px', value: 24, tw: 'rounded-2xl' },
  { label: 'Pill', value: 9999, tw: 'rounded-full' },
];

export const ShadowBorderControlPanel: React.FC<ShadowBorderControlPanelProps> = ({
  selectedElement,
  classList,
  onApplyClasses,
  attributes,
  onUpdateAttribute,
  isDark = true
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Border state variables
  const [borderRadius, setBorderRadius] = useState<number>(12);
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderStyle, setBorderStyle] = useState<string>('solid');
  const [borderColor, setBorderColor] = useState<string>('#6366f1');
  const [borderOpacity, setBorderOpacity] = useState<number>(100);

  // Box Shadow state variables
  const [shadowType, setShadowType] = useState<'preset' | 'custom'>('preset');
  const [activePresetId, setActivePresetId] = useState<string>('lg');
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(10);
  const [blurRadius, setBlurRadius] = useState<number>(20);
  const [spreadRadius, setSpreadRadius] = useState<number>(0);
  const [shadowColor, setShadowColor] = useState<string>('#6366f1');
  const [shadowOpacity, setShadowOpacity] = useState<number>(35);
  const [isInset, setIsInset] = useState<boolean>(false);

  const [copiedCss, setCopiedCss] = useState(false);
  const [copiedTw, setCopiedTw] = useState(false);

  // Parse element styles or classes on load or selection change
  useEffect(() => {
    if (!selectedElement) return;

    // Inspect existing inline style attribute if present
    const rawStyle = attributes.style || '';
    if (rawStyle) {
      const radiusMatch = rawStyle.match(/border-radius\s*:\s*(\d+)px/i);
      if (radiusMatch) setBorderRadius(parseInt(radiusMatch[1], 10));

      const widthMatch = rawStyle.match(/border-width\s*:\s*(\d+)px/i) || rawStyle.match(/border\s*:\s*(\d+)px/i);
      if (widthMatch) setBorderWidth(parseInt(widthMatch[1], 10));

      const colorMatch = rawStyle.match(/border-color\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\(.*?\))/i);
      if (colorMatch) setBorderColor(colorMatch[1]);
    }

    // Inspect classList for shadow and radius classes
    const classes = classList.split(' ').filter(Boolean);
    if (classes.includes('rounded-none')) setBorderRadius(0);
    else if (classes.includes('rounded-sm')) setBorderRadius(4);
    else if (classes.includes('rounded') || classes.includes('rounded-md')) setBorderRadius(8);
    else if (classes.includes('rounded-lg')) setBorderRadius(12);
    else if (classes.includes('rounded-xl')) setBorderRadius(16);
    else if (classes.includes('rounded-2xl')) setBorderRadius(24);
    else if (classes.includes('rounded-3xl')) setBorderRadius(32);
    else if (classes.includes('rounded-full')) setBorderRadius(9999);

    if (classes.includes('border-0')) setBorderWidth(0);
    else if (classes.includes('border') || classes.includes('border-1')) setBorderWidth(1);
    else if (classes.includes('border-2')) setBorderWidth(2);
    else if (classes.includes('border-4')) setBorderWidth(4);
    else if (classes.includes('border-8')) setBorderWidth(8);
  }, [selectedElement]);

  // Convert Hex color to RGBA string with opacity
  const hexToRgba = (hex: string, opacityPercent: number) => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    const a = (opacityPercent / 100).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Compute computed box-shadow string
  const computedBoxShadowCss = useMemo(() => {
    if (shadowType === 'preset') {
      const found = SHADOW_PRESETS.find(p => p.id === activePresetId);
      return found ? found.css : 'none';
    }
    const colorRgba = hexToRgba(shadowColor, shadowOpacity);
    const insetText = isInset ? 'inset ' : '';
    return `${insetText}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${colorRgba}`;
  }, [shadowType, activePresetId, offsetX, offsetY, blurRadius, spreadRadius, shadowColor, shadowOpacity, isInset]);

  // Compute computed border CSS string
  const computedBorderColorRgba = useMemo(() => {
    return hexToRgba(borderColor, borderOpacity);
  }, [borderColor, borderOpacity]);

  const computedBorderCss = useMemo(() => {
    if (borderWidth === 0 || borderStyle === 'none') return 'none';
    return `${borderWidth}px ${borderStyle} ${computedBorderColorRgba}`;
  }, [borderWidth, borderStyle, computedBorderColorRgba]);

  const computedBorderRadiusCss = useMemo(() => {
    return `${borderRadius}px`;
  }, [borderRadius]);

  // Generate Tailwind classes equivalents
  const computedTailwindClasses = useMemo(() => {
    const list: string[] = [];

    // Border Radius TW
    if (borderRadius === 0) list.push('rounded-none');
    else if (borderRadius <= 4) list.push('rounded-sm');
    else if (borderRadius <= 8) list.push('rounded-md');
    else if (borderRadius <= 12) list.push('rounded-lg');
    else if (borderRadius <= 16) list.push('rounded-xl');
    else if (borderRadius <= 24) list.push('rounded-2xl');
    else if (borderRadius >= 999) list.push('rounded-full');

    // Border Width TW
    if (borderWidth === 0) list.push('border-0');
    else if (borderWidth === 1) list.push('border');
    else if (borderWidth === 2) list.push('border-2');
    else if (borderWidth >= 4) list.push('border-4');

    // Box Shadow TW
    if (shadowType === 'preset') {
      const found = SHADOW_PRESETS.find(p => p.id === activePresetId);
      if (found) list.push(found.tw);
    } else {
      list.push('shadow-xl');
    }

    return list.join(' ');
  }, [borderRadius, borderWidth, shadowType, activePresetId]);

  // Apply CSS Styles directly to selected element's inline style
  const handleApplyInlineStyle = () => {
    const currentStyleStr = attributes.style || '';
    // Strip existing box-shadow, border-radius, border, border-width, border-color, border-style
    const cleaned = currentStyleStr
      .split(';')
      .map(s => s.trim())
      .filter(s => s && 
        !s.startsWith('box-shadow') && 
        !s.startsWith('border-radius') && 
        !s.startsWith('border:') && 
        !s.startsWith('border-width') && 
        !s.startsWith('border-color') && 
        !s.startsWith('border-style')
      )
      .join('; ');

    const newStyleParts: string[] = [];
    if (cleaned) newStyleParts.push(cleaned);
    if (computedBoxShadowCss !== 'none') newStyleParts.push(`box-shadow: ${computedBoxShadowCss}`);
    if (borderRadius > 0) newStyleParts.push(`border-radius: ${computedBorderRadiusCss}`);
    if (borderWidth > 0 && borderStyle !== 'none') newStyleParts.push(`border: ${computedBorderCss}`);

    const newStyle = newStyleParts.join('; ');
    onUpdateAttribute('style', newStyle);
  };

  // Apply Tailwind classes to selected element's classList
  const handleApplyTailwind = () => {
    const currentList = classList.split(' ').filter(Boolean);
    const filterOut = [
      'shadow-none', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner',
      'rounded-none', 'rounded-sm', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full',
      'border-0', 'border', 'border-1', 'border-2', 'border-4', 'border-8'
    ];
    const cleanedList = currentList.filter(c => !filterOut.includes(c));
    const newTailwind = [...cleanedList, ...computedTailwindClasses.split(' ')].filter(Boolean).join(' ');
    onApplyClasses(newTailwind);
    handleApplyInlineStyle(); // Apply exact inline style for 100% precision
  };

  const handleCopyCss = () => {
    const cssText = `box-shadow: ${computedBoxShadowCss};\nborder-radius: ${computedBorderRadiusCss};\nborder: ${computedBorderCss};`;
    try {
      navigator.clipboard.writeText(cssText);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyTailwind = () => {
    try {
      navigator.clipboard.writeText(computedTailwindClasses);
      setCopiedTw(true);
      setTimeout(() => setCopiedTw(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className={`rounded-xl border transition-all text-xs font-sans ${
      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
              <span>Shadow & Border Studio</span>
              <span className="px-1.5 py-0.2 text-[9px] rounded font-mono font-bold bg-indigo-500/20 text-indigo-300">
                Visual Controls
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Box-shadow depth, border-radius & border styling
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-slate-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 pt-0 space-y-4 border-t border-slate-800/60 animate-fade-in">

          {/* Live Miniature Visual Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live Shadow & Border Preview</span>
              </span>
              <span className="text-[9px] text-indigo-400 font-mono">
                {borderRadius}px radius • {borderWidth}px border
              </span>
            </div>

            <div className={`p-6 rounded-xl border flex items-center justify-center relative overflow-hidden transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}>
              {/* Background grid pattern */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
                  backgroundSize: '12px 12px'
                }} 
              />

              {/* Sample Card displaying applied shadow and border */}
              <div
                className="w-48 h-20 p-3 bg-slate-950 text-slate-100 flex flex-col justify-center items-center text-center transition-all duration-150 relative z-10"
                style={{
                  boxShadow: computedBoxShadowCss,
                  borderRadius: computedBorderRadiusCss,
                  border: computedBorderCss,
                }}
              >
                <span className="font-bold text-xs text-indigo-300">Sample Card</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Visual Depth Test
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 1: BORDER RADIUS CONTROL */}
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                <CircleDot className="w-3.5 h-3.5 text-indigo-400" />
                <span>Border Radius</span>
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="0"
                  max="9999"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={`w-14 px-2 py-0.5 border rounded text-right font-mono text-xs focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-white border-slate-300 text-indigo-600'
                  }`}
                />
                <span className="text-[10px] text-slate-400 font-mono">px</span>
              </div>
            </div>

            {/* Slider for Border Radius */}
            <input
              type="range"
              min="0"
              max="48"
              step="1"
              value={borderRadius > 48 ? 48 : borderRadius}
              onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />

            {/* Radius Quick Presets */}
            <div className="grid grid-cols-7 gap-1">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBorderRadius(preset.value)}
                  className={`py-1 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                    borderRadius === preset.value
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: BORDER WIDTH, STYLE & COLOR */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>Border Width, Style & Color</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                {borderWidth}px {borderStyle}
              </span>
            </div>

            {/* Border Width Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Thickness</span>
                <span className="font-mono text-indigo-400">{borderWidth}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="1"
                value={borderWidth}
                onChange={(e) => setBorderWidth(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Border Style Select */}
            <div className="grid grid-cols-5 gap-1">
              {['solid', 'dashed', 'dotted', 'double', 'none'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setBorderStyle(style)}
                  className={`py-1 rounded text-[10px] font-semibold capitalize border transition-all cursor-pointer ${
                    borderStyle === style
                      ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                      : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Border Color Picker & Opacity */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Border Color</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className={`w-full px-2 py-1 rounded border text-[11px] font-mono focus:outline-none focus:border-purple-500 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Opacity</span>
                  <span className="font-mono text-purple-400">{borderOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={borderOpacity}
                  onChange={(e) => setBorderOpacity(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: BOX SHADOW CONTROL */}
          <div className="space-y-3 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Box Shadow Studio</span>
              </label>

              {/* Shadow Mode Toggle */}
              <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setShadowType('preset')}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                    shadowType === 'preset' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setShadowType('custom')}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                    shadowType === 'custom' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {shadowType === 'preset' ? (
              /* Presets Grid */
              <div className="grid grid-cols-2 gap-1.5">
                {SHADOW_PRESETS.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setActivePresetId(preset.id)}
                      className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                          : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-semibold">{preset.label}</span>
                      {isActive && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Custom Box Shadow Fine-Tuning Sliders */
              <div className="space-y-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                {/* Offset X Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Offset X (Horizontal)</span>
                    <span className="font-mono text-cyan-400">{offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Offset Y Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Offset Y (Vertical)</span>
                    <span className="font-mono text-cyan-400">{offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Blur Radius Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Blur Softness</span>
                    <span className="font-mono text-cyan-400">{blurRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={blurRadius}
                    onChange={(e) => setBlurRadius(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Spread Radius Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Spread Distance</span>
                    <span className="font-mono text-cyan-400">{spreadRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="40"
                    value={spreadRadius}
                    onChange={(e) => setSpreadRadius(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Shadow Color & Opacity */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block">Shadow Tint</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={shadowColor}
                        onChange={(e) => setShadowColor(e.target.value)}
                        className="w-full px-2 py-1 rounded border border-slate-800 bg-slate-950 text-slate-200 text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Shadow Opacity</span>
                      <span className="font-mono text-cyan-400">{shadowOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadowOpacity}
                      onChange={(e) => setShadowOpacity(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg mt-2"
                    />
                  </div>
                </div>

                {/* Inset Checkbox Toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-300 font-medium">Inset Inner Shadow</span>
                  <button
                    type="button"
                    onClick={() => setIsInset(!isInset)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      isInset
                        ? 'bg-cyan-600 text-white border-cyan-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {isInset ? 'Inset Active' : 'Outer Drop'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: APPLY TO CANVAS & COPY BUTTONS */}
          <div className="pt-2 border-t border-slate-800/60 space-y-2">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleApplyTailwind}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply Shadow & Border to Element</span>
              </button>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <button
                type="button"
                onClick={handleCopyCss}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors border border-slate-800 cursor-pointer"
              >
                {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedCss ? 'Copied CSS!' : 'Copy CSS Code'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyTailwind}
                className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors border border-slate-800 cursor-pointer"
              >
                {copiedTw ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedTw ? 'Copied TW!' : 'Copy Tailwind'}</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
