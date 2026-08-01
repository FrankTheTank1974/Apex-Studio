import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Type, 
  Check, 
  Copy, 
  Sparkles, 
  RefreshCw, 
  Wand2, 
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ThemeMode } from '../types';

export interface GoogleFont {
  name: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace' | 'handwriting';
  weights: number[];
  fallback: string;
  popular?: boolean;
}

export const GOOGLE_FONTS_CATALOG: GoogleFont[] = [
  // Sans-Serif
  { name: 'Inter', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800], fallback: 'sans-serif', popular: true },
  { name: 'Roboto', category: 'sans-serif', weights: [300, 400, 500, 700, 900], fallback: 'sans-serif', popular: true },
  { name: 'Plus Jakarta Sans', category: 'sans-serif', weights: [400, 500, 600, 700, 800], fallback: 'sans-serif', popular: true },
  { name: 'Poppins', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800], fallback: 'sans-serif', popular: true },
  { name: 'Montserrat', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800], fallback: 'sans-serif', popular: true },
  { name: 'Open Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800], fallback: 'sans-serif', popular: true },
  { name: 'Outfit', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800], fallback: 'sans-serif', popular: true },
  { name: 'Space Grotesk', category: 'sans-serif', weights: [300, 400, 500, 600, 700], fallback: 'sans-serif', popular: true },
  { name: 'DM Sans', category: 'sans-serif', weights: [400, 500, 700], fallback: 'sans-serif' },
  { name: 'Work Sans', category: 'sans-serif', weights: [300, 400, 500, 600, 700], fallback: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif', weights: [300, 400, 700, 900], fallback: 'sans-serif' },
  { name: 'Raleway', category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800], fallback: 'sans-serif' },

  // Serif
  { name: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700, 800, 900], fallback: 'serif', popular: true },
  { name: 'Merriweather', category: 'serif', weights: [300, 400, 700, 900], fallback: 'serif', popular: true },
  { name: 'Lora', category: 'serif', weights: [400, 500, 600, 700], fallback: 'serif', popular: true },
  { name: 'Cinzel', category: 'serif', weights: [400, 600, 700, 800], fallback: 'serif' },
  { name: 'Bodoni Moda', category: 'serif', weights: [400, 500, 600, 700, 800, 900], fallback: 'serif' },
  { name: 'Cormorant Garamond', category: 'serif', weights: [300, 400, 500, 600, 700], fallback: 'serif' },
  { name: 'PT Serif', category: 'serif', weights: [400, 700], fallback: 'serif' },

  // Display
  { name: 'Oswald', category: 'display', weights: [300, 400, 500, 600, 700], fallback: 'sans-serif', popular: true },
  { name: 'Bebas Neue', category: 'display', weights: [400], fallback: 'sans-serif', popular: true },
  { name: 'Syne', category: 'display', weights: [400, 600, 700, 800], fallback: 'sans-serif', popular: true },
  { name: 'Righteous', category: 'display', weights: [400], fallback: 'cursive' },
  { name: 'Abril Fatface', category: 'display', weights: [400], fallback: 'serif' },

  // Monospace
  { name: 'Fira Code', category: 'monospace', weights: [300, 400, 500, 600, 700], fallback: 'monospace', popular: true },
  { name: 'JetBrains Mono', category: 'monospace', weights: [300, 400, 500, 600, 700, 800], fallback: 'monospace', popular: true },
  { name: 'Space Mono', category: 'monospace', weights: [400, 700], fallback: 'monospace' },
  { name: 'Inconsolata', category: 'monospace', weights: [300, 400, 600, 700, 800], fallback: 'monospace' },

  // Handwriting
  { name: 'Pacifico', category: 'handwriting', weights: [400], fallback: 'cursive', popular: true },
  { name: 'Dancing Script', category: 'handwriting', weights: [400, 600, 700], fallback: 'cursive', popular: true },
  { name: 'Caveat', category: 'handwriting', weights: [400, 600, 700], fallback: 'cursive' },
];

export interface FontPairing {
  name: string;
  description: string;
  headingFont: string;
  bodyFont: string;
  category: string;
}

export const CURATED_FONT_PAIRINGS: FontPairing[] = [
  {
    name: 'Modern Tech SaaS',
    description: 'Clean, high-tech aesthetic for modern web applications',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    category: 'SaaS & Apps',
  },
  {
    name: 'Editorial Elegance',
    description: 'Sophisticated serif headings paired with readable body text',
    headingFont: 'Playfair Display',
    bodyFont: 'Lora',
    category: 'Editorial & Blogs',
  },
  {
    name: 'Developer & Code',
    description: 'Futuristic geometric title paired with developer-friendly mono',
    headingFont: 'Space Grotesk',
    bodyFont: 'Fira Code',
    category: 'Developer Tools',
  },
  {
    name: 'Bold Impact',
    description: 'Punchy uppercase display font paired with clean body copy',
    headingFont: 'Oswald',
    bodyFont: 'Work Sans',
    category: 'Marketing & Portfolios',
  },
  {
    name: 'Minimalist Studio',
    description: 'Contemporary rounded geometry with optimal screen readability',
    headingFont: 'Outfit',
    bodyFont: 'DM Sans',
    category: 'Agency & Creative',
  },
];

interface GoogleFontsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cssContent: string;
  onUpdateCssContent: (newCss: string) => void;
  themeMode?: ThemeMode;
}

export const GoogleFontsModal: React.FC<GoogleFontsModalProps> = ({
  isOpen,
  onClose,
  cssContent,
  onUpdateCssContent,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewText, setPreviewText] = useState('Build & Deploy Web Apps Faster Than Ever');
  const [fontSize, setFontSize] = useState<number>(24);
  const [targetRole, setTargetRole] = useState<'body' | 'headings' | 'mono'>('body');
  const [selectedFont, setSelectedFont] = useState<GoogleFont>(GOOGLE_FONTS_CATALOG[0]);
  const [selectedWeight, setSelectedWeight] = useState<number>(400);
  const [copiedImport, setCopiedImport] = useState(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Dynamically load Google Font CSS tags in parent head so previews work instantly in modal
  useEffect(() => {
    if (!isOpen) return;

    // Load top popular fonts into document head for previewing
    const fontNames = GOOGLE_FONTS_CATALOG.map((f) => f.name.replace(/\s+/g, '+')).join('&family=');
    const linkId = 'apex-google-fonts-preview';
    let linkEl = document.getElementById(linkId) as HTMLLinkElement;

    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = linkId;
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }

    linkEl.href = `https://fonts.googleapis.com/css2?family=${fontNames}&display=swap`;
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter fonts by search query and category
  const filteredFonts = GOOGLE_FONTS_CATALOG.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Generate Google Fonts @import URL for a given font
  const getGoogleFontImportUrl = (font: GoogleFont, weight = 400) => {
    const formattedName = font.name.replace(/\s+/g, '+');
    return `@import url('https://fonts.googleapis.com/css2?family=${formattedName}:wght@${weight}&display=swap');`;
  };

  // Generate CSS Rule
  const getCssRule = (font: GoogleFont, role: 'body' | 'headings' | 'mono') => {
    const fontFamily = `'${font.name}', ${font.fallback}`;
    if (role === 'headings') {
      return `h1, h2, h3, h4, h5, h6 {\n  font-family: ${fontFamily};\n}`;
    }
    if (role === 'mono') {
      return `code, pre, .font-mono {\n  font-family: ${fontFamily};\n}`;
    }
    return `body {\n  font-family: ${fontFamily};\n}`;
  };

  // Apply single font to CSS
  const handleApplyFont = (font: GoogleFont, role: 'body' | 'headings' | 'mono' = targetRole, weight = selectedWeight) => {
    const importStatement = getGoogleFontImportUrl(font, weight);
    const cssRule = getCssRule(font, role);

    let updatedCss = cssContent;

    // Remove existing import for this font if present to prevent duplication
    const importRegex = new RegExp(`@import\\s+url\\(['"]https://fonts\\.googleapis\\.com/css2\\?family=${font.name.replace(/\s+/g, '\\+')}[^'"]*['"]\\);?`, 'g');
    updatedCss = updatedCss.replace(importRegex, '').trim();

    // Add import statement at the top
    updatedCss = `${importStatement}\n\n${updatedCss}`;

    // Update or append selector rule
    let selector = 'body';
    if (role === 'headings') selector = 'h1, h2, h3, h4, h5, h6';
    if (role === 'mono') selector = 'code, pre, .font-mono';

    // Simple replacement or append
    if (updatedCss.includes(`${selector} {`)) {
      const selectorRegex = new RegExp(`${selector.replace(/,/g, '\\,')}\\s*\\{[^}]*\\}`, 'g');
      updatedCss = updatedCss.replace(selectorRegex, cssRule);
    } else {
      updatedCss += `\n\n${cssRule}`;
    }

    onUpdateCssContent(updatedCss);
    setAppliedNotification(`Applied '${font.name}' to ${role.toUpperCase()} in global CSS!`);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  // Apply curated pairing
  const handleApplyPairing = (pairing: FontPairing) => {
    const headingFont = GOOGLE_FONTS_CATALOG.find((f) => f.name === pairing.headingFont) || GOOGLE_FONTS_CATALOG[0];
    const bodyFont = GOOGLE_FONTS_CATALOG.find((f) => f.name === pairing.bodyFont) || GOOGLE_FONTS_CATALOG[1];

    const import1 = getGoogleFontImportUrl(headingFont, 700);
    const import2 = getGoogleFontImportUrl(bodyFont, 400);

    const rule1 = getCssRule(headingFont, 'headings');
    const rule2 = getCssRule(bodyFont, 'body');

    let updatedCss = cssContent;
    // Add imports to top
    updatedCss = `${import1}\n${import2}\n\n${updatedCss}`;
    updatedCss += `\n\n${rule1}\n\n${rule2}`;

    onUpdateCssContent(updatedCss);
    setAppliedNotification(`Applied '${pairing.name}' font pairing!`);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleCopyImport = (font: GoogleFont) => {
    const text = getGoogleFontImportUrl(font, selectedWeight);
    navigator.clipboard.writeText(text);
    setCopiedImport(true);
    setTimeout(() => setCopiedImport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className={`w-full max-w-5xl h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden font-sans ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/80'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <span>Google Fonts Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-mono font-semibold border border-indigo-500/30">
                  Real-time CSS Sync
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Browse Google Fonts, preview live typography, and apply typography rules directly to global CSS.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Applied Notification Banner */}
        {appliedNotification && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-semibold flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{appliedNotification}</span>
            </div>
            <span className="text-[10px] opacity-80 font-mono">Live canvas updated</span>
          </div>
        )}

        {/* Studio Content Area: Left Catalog & Right Editor */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Font Browser & Filters */}
          <div className={`w-full md:w-1/2 flex flex-col border-r overflow-hidden ${
            isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/40'
          }`}>
            {/* Search & Category Filter Header */}
            <div className="p-4 border-b border-slate-800/60 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Google Fonts (e.g. Inter, Playfair, Fira Code)..."
                  className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
                  }`}
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {['all', 'sans-serif', 'serif', 'display', 'monospace', 'handwriting'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isDark
                          ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {cat === 'all' ? 'All Fonts' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Cards List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredFonts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No Google Fonts found matching "{searchQuery}".
                </div>
              ) : (
                filteredFonts.map((font) => {
                  const isSelected = selectedFont.name === font.name;
                  return (
                    <div
                      key={font.name}
                      onClick={() => {
                        setSelectedFont(font);
                        if (!font.weights.includes(selectedWeight)) {
                          setSelectedWeight(font.weights[0] || 400);
                        }
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? isDark
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                            : 'bg-indigo-50 border-indigo-500 shadow-md'
                          : isDark
                            ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                            : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm tracking-tight">{font.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                            isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {font.category}
                          </span>
                          {font.popular && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30">
                              ★ Popular
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyFont(font);
                          }}
                          className="opacity-0 group-hover:opacity-100 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center space-x-1"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>Apply</span>
                        </button>
                      </div>

                      {/* Live Preview Text in the Font */}
                      <div
                        style={{ fontFamily: `'${font.name}', ${font.fallback}` }}
                        className={`text-base truncate transition-all leading-snug ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}
                      >
                        {previewText || 'The quick brown fox jumps over the lazy dog'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Live Font Configurator & Curated Pairings */}
          <div className="w-full md:w-1/2 flex flex-col overflow-y-auto p-6 space-y-6">
            {/* Active Selected Font Panel */}
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Selected Font</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span>{selectedFont.name}</span>
                    <a
                      href={`https://fonts.google.com/specimen/${selectedFont.name.replace(/\s+/g, '+')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-400 transition-colors"
                      title="View on Google Fonts Official Specimen"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyImport(selectedFont)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all cursor-pointer ${
                      copiedImport
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isDark
                          ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-xs'
                    }`}
                  >
                    {copiedImport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedImport ? 'Copied @import!' : 'Copy @import'}</span>
                  </button>
                </div>
              </div>

              {/* Sample Custom Text Input & Font Size Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Custom Preview Text</label>
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Preview Size ({fontSize}px)</label>
                  <input
                    type="range"
                    min={14}
                    max={48}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
                  />
                </div>
              </div>

              {/* Font Weight Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Font Weight Variant</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFont.weights.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWeight(w)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                        selectedWeight === w
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isDark
                            ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target CSS Selector / Role Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Target CSS Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetRole('body')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      targetRole === 'body'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Body Text</div>
                    <div className="text-[10px] opacity-70 font-mono">body {'{}'}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetRole('headings')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      targetRole === 'headings'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Headings</div>
                    <div className="text-[10px] opacity-70 font-mono">h1, h2, h3...</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetRole('mono')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      targetRole === 'mono'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                        : isDark
                          ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Code / Mono</div>
                    <div className="text-[10px] opacity-70 font-mono">code, pre...</div>
                  </button>
                </div>
              </div>

              {/* Live Scaled Preview Container */}
              <div className={`p-4 rounded-xl border overflow-hidden transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-inner'
              }`}>
                <div
                  style={{
                    fontFamily: `'${selectedFont.name}', ${selectedFont.fallback}`,
                    fontWeight: selectedWeight,
                    fontSize: `${fontSize}px`
                  }}
                  className="leading-snug break-words"
                >
                  {previewText || 'The quick brown fox jumps over the lazy dog'}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleApplyFont(selectedFont)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Apply {selectedFont.name} to Global CSS</span>
              </button>
            </div>

            {/* CURATED FONT PAIRINGS PRESETS */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Curated Font Pairings</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {CURATED_FONT_PAIRINGS.map((pairing) => (
                  <div
                    key={pairing.name}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50'
                        : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs">{pairing.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {pairing.category}
                        </span>
                      </div>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {pairing.description}
                      </p>

                      <div className="flex items-center space-x-3 text-xs pt-1">
                        <span style={{ fontFamily: `'${pairing.headingFont}', serif` }} className="font-bold text-indigo-400">
                          H: {pairing.headingFont}
                        </span>
                        <span>+</span>
                        <span style={{ fontFamily: `'${pairing.bodyFont}', sans-serif` }} className="text-slate-300">
                          B: {pairing.bodyFont}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyPairing(pairing)}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-600 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
                    >
                      Apply Both
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
