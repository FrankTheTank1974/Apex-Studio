import React, { useState } from 'react';
import { Sparkles, Copy, Check, Wand2, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft, ArrowUp, ArrowUpRight, Palette } from 'lucide-react';
import { ThemeMode } from '../types';

export interface GradientPreset {
  name: string;
  category: string;
  classes: string;
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  { name: 'Sunset Glow', category: 'Vibrant', classes: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600' },
  { name: 'Cyberpunk Neon', category: 'Vibrant', classes: 'bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500' },
  { name: 'Deep Ocean', category: 'Dark & Deep', classes: 'bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900' },
  { name: 'Emerald Forest', category: 'Nature', classes: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-700' },
  { name: 'Electric Violet', category: 'Modern', classes: 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500' },
  { name: 'Golden Hour', category: 'Warm', classes: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-red-500' },
  { name: 'Aurora Borealis', category: 'Nature', classes: 'bg-gradient-to-r from-teal-400 via-emerald-500 to-indigo-600' },
  { name: 'Rose Gold', category: 'Pastel & Luxury', classes: 'bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300' },
  { name: 'Midnight Shadow', category: 'Dark & Deep', classes: 'bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900' },
  { name: 'Hyper Drive', category: 'Modern', classes: 'bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600' },
  { name: 'Peachy Breeze', category: 'Warm', classes: 'bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400' },
  { name: 'Cosmic Fusion', category: 'Dark & Deep', classes: 'bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700' },
  { name: 'Vibrant Lime', category: 'Vibrant', classes: 'bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-600' },
  { name: 'Candy Floss', category: 'Pastel & Luxury', classes: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400' },
  { name: 'Dark Obsidian', category: 'Dark & Deep', classes: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black' },
  { name: 'Sunfire Gold', category: 'Warm', classes: 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-600' },
];

export const TAILWIND_COLORS = [
  'slate', 'gray', 'red', 'orange', 'amber', 'yellow', 'lime', 
  'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 
  'purple', 'fuchsia', 'pink', 'rose'
];

export const COLOR_SHADES = ['300', '400', '500', '600', '700', '800', '900'];

export const GRADIENT_DIRECTIONS = [
  { label: 'Right', value: 'bg-gradient-to-r', icon: ArrowRight },
  { label: 'Bottom Right', value: 'bg-gradient-to-br', icon: ArrowDownRight },
  { label: 'Bottom', value: 'bg-gradient-to-b', icon: ArrowDown },
  { label: 'Bottom Left', value: 'bg-gradient-to-bl', icon: ArrowDownLeft },
  { label: 'Left', value: 'bg-gradient-to-l', icon: ArrowLeft },
  { label: 'Top Left', value: 'bg-gradient-to-tl', icon: ArrowUpLeft },
  { label: 'Top', value: 'bg-gradient-to-t', icon: ArrowUp },
  { label: 'Top Right', value: 'bg-gradient-to-tr', icon: ArrowUpRight },
];

interface GradientBuilderProps {
  onApplyGradient: (gradientClassString: string) => void;
  themeMode?: ThemeMode;
}

export const GradientBuilder: React.FC<GradientBuilderProps> = ({
  onApplyGradient,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  const [direction, setDirection] = useState('bg-gradient-to-r');
  const [fromColor, setFromColor] = useState('indigo');
  const [fromShade, setFromShade] = useState('600');

  const [viaEnabled, setViaEnabled] = useState(true);
  const [viaColor, setViaColor] = useState('purple');
  const [viaShade, setViaShade] = useState('600');

  const [toColor, setToColor] = useState('pink');
  const [toShade, setToShade] = useState('500');

  const [isTextGradient, setIsTextGradient] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  // Compute exact Tailwind class string
  const customClassString = `${direction} from-${fromColor}-${fromShade} ${
    viaEnabled ? `via-${viaColor}-${viaShade} ` : ''
  }to-${toColor}-${toShade}${isTextGradient ? ' bg-clip-text text-transparent' : ''}`.trim();

  const handleApply = (classesToApply?: string) => {
    const targetStr = classesToApply || customClassString;
    const finalStr = isTextGradient && !targetStr.includes('bg-clip-text')
      ? `${targetStr} bg-clip-text text-transparent`
      : targetStr;
    onApplyGradient(finalStr);
  };

  const handleCopy = (classesToCopy?: string) => {
    const targetStr = classesToCopy || customClassString;
    navigator.clipboard.writeText(targetStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-3 border rounded-xl space-y-3 ${
      isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="flex items-center space-x-1.5 font-bold text-xs text-indigo-400">
          <Palette className="w-4 h-4 text-pink-500" />
          <span>Tailwind Gradient Studio</span>
        </span>

        {/* Mode Tabs */}
        <div className="flex bg-slate-800/60 p-0.5 rounded-lg text-[10px] font-medium border border-slate-700/50">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Mixer
          </button>
        </div>
      </div>

      {/* Target Type Switcher: Background vs Text Gradient */}
      <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-900/40 border border-slate-800/80">
        <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Apply gradient to:
        </span>
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={() => setIsTextGradient(false)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              !isTextGradient
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Background
          </button>
          <button
            type="button"
            onClick={() => setIsTextGradient(true)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              isTextGradient
                ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Text Color
          </button>
        </div>
      </div>

      {/* TAB 1: PRESETS */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {GRADIENT_PRESETS.map((preset) => {
              const displayClasses = isTextGradient 
                ? `${preset.classes} bg-clip-text text-transparent font-extrabold`
                : preset.classes;

              return (
                <div
                  key={preset.name}
                  onClick={() => handleApply(preset.classes)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer group hover:scale-[1.02] ${
                    isDark ? 'bg-slate-900 border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-xs'
                  }`}
                >
                  {/* Swatch Preview Box */}
                  <div className={`h-9 w-full rounded-lg mb-1.5 flex items-center justify-center p-1 shadow-inner ${displayClasses}`}>
                    {isTextGradient && <span className="text-xs">Aa Text</span>}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold truncate text-slate-800 dark:text-slate-200">
                      {preset.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(preset.classes);
                      }}
                      className="opacity-0 group-hover:opacity-100 px-1.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9px] font-bold transition-opacity"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM GRADIENT MIXER */}
      {activeTab === 'custom' && (
        <div className="space-y-3 text-xs">
          {/* Live Custom Swatch Preview */}
          <div className="space-y-1">
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Live Preview</span>
            <div className={`h-12 w-full rounded-xl border flex items-center justify-center transition-all shadow-inner ${
              isDark ? 'border-slate-800' : 'border-slate-300'
            } ${customClassString}`}>
              {isTextGradient && (
                <span className="text-base font-extrabold tracking-tight">
                  Gradient Text Preview
                </span>
              )}
            </div>
          </div>

          {/* Direction Selector */}
          <div className="space-y-1">
            <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gradient Direction</span>
            <div className="grid grid-cols-4 gap-1">
              {GRADIENT_DIRECTIONS.map((dir) => {
                const IconComponent = dir.icon;
                const isSel = direction === dir.value;
                return (
                  <button
                    key={dir.value}
                    type="button"
                    onClick={() => setDirection(dir.value)}
                    className={`p-1.5 rounded-lg border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSel
                        ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                    title={dir.label}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="text-[9px] truncate mt-0.5">{dir.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Stop 1: FROM */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-indigo-400">FROM Color Stop</span>
              <span className="font-mono text-slate-400">from-{fromColor}-{fromShade}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={fromColor}
                onChange={(e) => setFromColor(e.target.value)}
                className={`p-1.5 border rounded-lg text-xs capitalize ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {TAILWIND_COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={fromShade}
                onChange={(e) => setFromShade(e.target.value)}
                className={`p-1.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {COLOR_SHADES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Stop 2: VIA (Middle stop optional) */}
          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-[10px]">
              <label className="flex items-center space-x-1 cursor-pointer font-bold text-purple-400">
                <input
                  type="checkbox"
                  checked={viaEnabled}
                  onChange={(e) => setViaEnabled(e.target.checked)}
                  className="rounded accent-purple-600"
                />
                <span>VIA Middle Stop</span>
              </label>
              {viaEnabled && <span className="font-mono text-slate-400">via-{viaColor}-{viaShade}</span>}
            </div>

            {viaEnabled && (
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={viaColor}
                  onChange={(e) => setViaColor(e.target.value)}
                  className={`p-1.5 border rounded-lg text-xs capitalize ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {TAILWIND_COLORS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={viaShade}
                  onChange={(e) => setViaShade(e.target.value)}
                  className={`p-1.5 border rounded-lg text-xs ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {COLOR_SHADES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Color Stop 3: TO */}
          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-pink-400">TO Color Stop</span>
              <span className="font-mono text-slate-400">to-{toColor}-{toShade}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <select
                value={toColor}
                onChange={(e) => setToColor(e.target.value)}
                className={`p-1.5 border rounded-lg text-xs capitalize ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {TAILWIND_COLORS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={toShade}
                onChange={(e) => setToShade(e.target.value)}
                className={`p-1.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {COLOR_SHADES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={() => handleApply()}
              className="flex-1 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Apply Custom Gradient</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopy()}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-1 cursor-pointer ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-300 text-slate-700'
              }`}
              title="Copy gradient classes string"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
