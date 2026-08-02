import React, { useState, useEffect } from 'react';
import { 
  X, 
  Link as LinkIcon, 
  ExternalLink, 
  Anchor, 
  Mail, 
  Phone, 
  Download, 
  Check, 
  Copy, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Layers,
  Globe,
  Tag,
  FileCode
} from 'lucide-react';
import { ProjectFile, ThemeMode } from '../types';

interface QuickLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: ProjectFile[];
  activeFileId: string;
  onInsertLinkHtml: (htmlSnippet: string) => void;
  themeMode: ThemeMode;
}

export const QuickLinkModal: React.FC<QuickLinkModalProps> = ({
  isOpen,
  onClose,
  files,
  activeFileId,
  onInsertLinkHtml,
  themeMode,
}) => {
  const isDark = themeMode === 'dark';

  // State
  const [linkText, setLinkText] = useState('Explore Features');
  const [linkType, setLinkType] = useState<'url' | 'page' | 'anchor' | 'email' | 'phone' | 'download'>('url');
  const [urlAddress, setUrlAddress] = useState('https://example.com');
  const [selectedProjectPage, setSelectedProjectPage] = useState<string>('index.html');
  const [selectedAnchor, setSelectedAnchor] = useState('#features');
  const [emailAddress, setEmailAddress] = useState('contact@example.com');
  const [phoneNumber, setPhoneNumber] = useState('+18005550199');
  const [downloadPath, setDownloadPath] = useState('/assets/document.pdf');

  const [stylePreset, setStylePreset] = useState<'text-underline' | 'text-arrow' | 'button-solid' | 'button-outline' | 'button-ghost' | 'pill-badge' | 'gradient-glow'>('button-solid');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);

  // Extract all section IDs from active HTML file for quick anchor linking
  const [detectedSectionIds, setDetectedSectionIds] = useState<string[]>([]);
  const htmlFiles = files.filter((f) => f.type === 'html');

  useEffect(() => {
    if (!isOpen) return;

    if (htmlFiles.length > 0 && !htmlFiles.some((f) => f.name === selectedProjectPage)) {
      setSelectedProjectPage(htmlFiles[0].name);
    }

    const activeFile = files.find((f) => f.id === activeFileId) || htmlFiles[0];
    if (activeFile && activeFile.type === 'html') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(activeFile.content, 'text/html');
        const ids: string[] = [];
        doc.querySelectorAll('[id]').forEach((el) => {
          const id = el.getAttribute('id');
          if (id && !id.startsWith('apex-')) {
            ids.push(`#${id}`);
          }
        });
        setDetectedSectionIds(ids);
        if (ids.length > 0 && !ids.includes(selectedAnchor)) {
          setSelectedAnchor(ids[0]);
        }
      } catch (e) {
        console.warn('Error parsing document IDs:', e);
      }
    }
  }, [files, activeFileId, isOpen]);

  // Calculate final href attribute
  const getHref = (): string => {
    switch (linkType) {
      case 'url':
        return urlAddress.trim() || 'https://example.com';
      case 'page':
        return selectedProjectPage || 'index.html';
      case 'anchor':
        return selectedAnchor.trim() || '#section';
      case 'email':
        return `mailto:${emailAddress.trim() || 'info@example.com'}`;
      case 'phone':
        return `tel:${phoneNumber.trim() || '+18005550199'}`;
      case 'download':
        return downloadPath.trim() || '/assets/file.pdf';
      default:
        return '#';
    }
  };

  // Generate complete HTML string based on selected preset & options
  const generateLinkHtml = (): string => {
    const href = getHref();
    const text = linkText.trim() || 'Click Here';
    const targetAttr = openInNewTab && (linkType === 'url' || linkType === 'download') ? ' target="_blank" rel="noopener noreferrer"' : '';
    const downloadAttr = linkType === 'download' ? ' download' : '';

    let classNames = '';

    switch (stylePreset) {
      case 'text-underline':
        classNames = 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 font-normal transition-colors';
        return `<a href="${href}"${targetAttr}${downloadAttr} class="${classNames}">${text}</a>`;

      case 'text-arrow':
        classNames = 'inline-flex items-center space-x-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-all group';
        return `<a href="${href}"${targetAttr}${downloadAttr} class="${classNames}">\n  <span>${text}</span>\n  <span class="transform group-hover:translate-x-1 transition-transform">→</span>\n</a>`;

      case 'button-solid':
        classNames = 'inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5';
        return `<a href="${href}"${targetAttr}${downloadAttr} class="${classNames}">\n  ${text}\n</a>`;

      case 'button-outline':
        classNames = 'inline-flex items-center justify-center px-5 py-2.5 bg-transparent border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold rounded-xl transition-all';
        return `<a href="${href}"${targetAttr}${downloadAttr} class="${classNames}">\n  ${text}\n</a>`;

      case 'button-ghost':
        classNames = 'inline-flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 font-medium rounded-xl transition-all';
        return `<a href="${href}"${targetAttr}${downloadAttr} class="${classNames}">\n  ${text}\n</a>`;

      case 'pill-badge':
        classNames = 'inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full text-xs font-bold hover:bg-indigo-200 transition-all';
        return `<a href="${href}"${targetAttr}${downloadAttr} class="${classNames}">\n  <span>⚡</span>\n  <span>${text}</span>\n</a>`;

      case 'gradient-glow':
        classNames = 'inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all transform hover:scale-105';
        return `<a href="${href}"${targetAttr}${downloadAttr} class="${classNames}">\n  ${text}\n</a>`;

      default:
        return `<a href="${href}"${targetAttr}${downloadAttr} class="text-indigo-600 hover:underline">${text}</a>`;
    }
  };

  // Handlers
  const handleCopyHtml = () => {
    const html = generateLinkHtml();
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertLink = () => {
    const html = generateLinkHtml();
    onInsertLinkHtml(html);
    setInserted(true);
    setTimeout(() => {
      setInserted(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Modal Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Quick Link & Anchor Creator</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Create external URLs, page section anchors, email, phone, or download links easily
              </p>
            </div>
          </div>

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

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] scrollbar-thin">
          {/* 1. Link Text Label */}
          <div>
            <label className="block text-xs font-bold mb-1.5 flex items-center space-x-1.5">
              <span>1. Link Display Text</span>
              <span className="text-indigo-400 text-[10px] font-normal">(Visible text shown on button/hyperlink)</span>
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="e.g. Explore Features, Call Us, Get Started..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 focus:border-indigo-500 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {/* 2. Link Destination Type */}
          <div>
            <label className="block text-xs font-bold mb-1.5">2. Link Destination Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setLinkType('url')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  linkType === 'url'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-bold'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Web URL</span>
              </button>

              <button
                type="button"
                onClick={() => setLinkType('page')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  linkType === 'page'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-bold'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>Project Page</span>
              </button>

              <button
                type="button"
                onClick={() => setLinkType('anchor')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  linkType === 'anchor'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-bold'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Anchor className="w-4 h-4 text-purple-400" />
                <span>Section (#)</span>
              </button>

              <button
                type="button"
                onClick={() => setLinkType('email')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  linkType === 'email'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-bold'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={() => setLinkType('phone')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  linkType === 'phone'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-bold'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Phone</span>
              </button>

              <button
                type="button"
                onClick={() => setLinkType('download')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  linkType === 'download'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-bold'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Download className="w-4 h-4 text-rose-400" />
                <span>File</span>
              </button>
            </div>
          </div>

          {/* Destination Address Inputs */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            {linkType === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-cyan-400">Target Web Address (URL)</label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={urlAddress}
                    onChange={(e) => setUrlAddress(e.target.value)}
                    placeholder="https://example.com"
                    className={`flex-1 px-3 py-2 rounded-xl border text-xs outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <div className="flex items-center space-x-1">
                    {['https://google.com', 'https://github.com', '#demo'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setUrlAddress(preset)}
                        className={`px-2 py-1 rounded text-[10px] border ${
                          isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {preset.replace('https://', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {linkType === 'page' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-indigo-400">Link to Existing HTML Page in Project</label>
                  <span className="text-[10px] text-slate-400">Select HTML target page</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {htmlFiles.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedProjectPage(f.name)}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedProjectPage === f.name
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md font-bold'
                          : isDark ? 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  Target relative path: <code className="text-indigo-400 font-mono">{selectedProjectPage}</code>
                </p>
              </div>
            )}

            {linkType === 'anchor' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-purple-400">Page Section ID Anchor (#)</label>
                  <span className="text-[10px] text-slate-400">Smooth scroll to page section</span>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={selectedAnchor}
                    onChange={(e) => setSelectedAnchor(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
                    placeholder="#features"
                    className={`flex-1 px-3 py-2 rounded-xl border text-xs font-mono outline-none ${
                      isDark ? 'bg-slate-900 border-slate-700 text-purple-300' : 'bg-white border-slate-300 text-purple-900'
                    }`}
                  />
                </div>

                {detectedSectionIds.length > 0 ? (
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1">Detected IDs in active HTML file:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {detectedSectionIds.map((id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedAnchor(id)}
                          className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${
                            selectedAnchor === id
                              ? 'bg-purple-600 text-white border-purple-500 font-bold'
                              : isDark ? 'bg-slate-800 text-purple-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-purple-800 border-slate-300'
                          }`}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-1 flex flex-wrap gap-1.5 text-xs font-mono">
                    {['#hero', '#features', '#pricing', '#about', '#contact', '#faq', '#footer'].map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedAnchor(id)}
                        className={`px-2 py-0.5 rounded text-[11px] border ${
                          selectedAnchor === id ? 'bg-purple-600 text-white border-purple-500' : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {linkType === 'email' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-amber-400">Email Address (mailto:)</label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="support@example.com"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            )}

            {linkType === 'phone' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-emerald-400">Phone Number (tel:)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+18005550199"
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            )}

            {linkType === 'download' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-rose-400">Download File Path / URL</label>
                <input
                  type="text"
                  value={downloadPath}
                  onChange={(e) => setDownloadPath(e.target.value)}
                  placeholder="/assets/document.pdf or https://..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs outline-none ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            )}
          </div>

          {/* 3. Link Visual Style Preset */}
          <div>
            <label className="block text-xs font-bold mb-1.5">3. Link Visual Style Preset</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setStylePreset('text-underline')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  stylePreset === 'text-underline'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md font-bold'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-bold underline text-cyan-300">Classic Underline</span>
                <span className="text-[10px] opacity-75">Old-school blue link</span>
              </button>

              <button
                type="button"
                onClick={() => setStylePreset('button-solid')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  stylePreset === 'button-solid'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-bold">Solid Action Button</span>
                <span className="text-[10px] opacity-75">Classic CTA button</span>
              </button>

              <button
                type="button"
                onClick={() => setStylePreset('button-outline')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  stylePreset === 'button-outline'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-bold">Bordered Outline</span>
                <span className="text-[10px] opacity-75">Secondary outline</span>
              </button>

              <button
                type="button"
                onClick={() => setStylePreset('text-arrow')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  stylePreset === 'text-arrow'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-bold">Hyperlink with Arrow →</span>
                <span className="text-[10px] opacity-75">Inline hover link</span>
              </button>

              <button
                type="button"
                onClick={() => setStylePreset('button-ghost')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  stylePreset === 'button-ghost'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-bold">Soft Ghost Tint</span>
                <span className="text-[10px] opacity-75">Light tint background</span>
              </button>

              <button
                type="button"
                onClick={() => setStylePreset('pill-badge')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  stylePreset === 'pill-badge'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-bold">Rounded Pill Badge</span>
                <span className="text-[10px] opacity-75">Capsule tag link</span>
              </button>

              <button
                type="button"
                onClick={() => setStylePreset('gradient-glow')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                  stylePreset === 'gradient-glow'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <span className="font-bold">Gradient Glow ✨</span>
                <span className="text-[10px] opacity-75">High contrast modern</span>
              </button>
            </div>
          </div>

          {/* 4. Target Settings */}
          {(linkType === 'url' || linkType === 'download') && (
            <div className="flex items-center space-x-2 pt-1">
              <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
                />
                <span>Open in new browser tab (<code className="text-indigo-400">target="_blank"</code> with secure <code className="text-indigo-400">rel="noopener"</code>)</span>
              </label>
            </div>
          )}

          {/* Live Link Render Preview */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-400">Live Rendered Link Preview:</span>
            <div className={`p-6 rounded-2xl border flex items-center justify-center min-h-[90px] ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
            }`}>
              <div dangerouslySetInnerHTML={{ __html: generateLinkHtml() }} />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            type="button"
            onClick={handleCopyHtml}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-500'
                : isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Tag Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Copy HTML Tag</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleInsertLink}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center space-x-1.5 shadow-lg transition-all cursor-pointer ${
                inserted
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
              }`}
            >
              {inserted ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Inserted into Document!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Insert Link into HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
