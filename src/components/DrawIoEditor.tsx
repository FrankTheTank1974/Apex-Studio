import React, { useEffect, useRef, useState } from 'react';
import { Workflow, X, Save, Check, RotateCw, Palette, ChevronDown } from 'lucide-react';
import { DrawIoDiagram, ThemeMode } from '../types';
import { normalizeSvgContent } from '../utils/svgUtils';

interface DrawIoEditorProps {
  isOpen: boolean;
  onClose: () => void;
  activeDiagram?: DrawIoDiagram | null;
  onSaveDiagram: (diagram: DrawIoDiagram) => void;
  themeMode?: ThemeMode;
}

const BG_PRESETS = [
  { name: 'Transparent', value: 'none', colorClass: 'bg-transparent border-dashed border border-slate-400' },
  { name: 'Dark Slate', value: '#0f172a', colorClass: 'bg-[#0f172a]' },
  { name: 'Pitch Black', value: '#020617', colorClass: 'bg-[#020617]' },
  { name: 'Pure White', value: '#ffffff', colorClass: 'bg-white border border-slate-300' },
  { name: 'Soft Gray', value: '#f8fafc', colorClass: 'bg-[#f8fafc] border border-slate-300' },
  { name: 'Warm Paper', value: '#fefcbf', colorClass: 'bg-[#fefcbf] border border-amber-300' },
  { name: 'Blueprint Navy', value: '#1e3a8a', colorClass: 'bg-[#1e3a8a]' },
  { name: 'Emerald Dark', value: '#064e3b', colorClass: 'bg-[#064e3b]' },
  { name: 'Deep Purple', value: '#3b0764', colorClass: 'bg-[#3b0764]' },
  { name: 'Charcoal', value: '#18181b', colorClass: 'bg-[#18181b]' },
];

export const DrawIoEditor: React.FC<DrawIoEditorProps> = ({
  isOpen,
  onClose,
  activeDiagram,
  onSaveDiagram,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [diagramTitle, setDiagramTitle] = useState(activeDiagram?.title || 'System Architecture Diagram');
  const [currentXml, setCurrentXml] = useState(activeDiagram?.xml || '');
  const [bgColor, setBgColor] = useState<string>(activeDiagram?.bgColor || (isDark ? '#0f172a' : 'none'));
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeDiagram) {
      setDiagramTitle(activeDiagram.title);
      setCurrentXml(activeDiagram.xml);
      if (activeDiagram.bgColor) {
        setBgColor(activeDiagram.bgColor);
      }
    }
  }, [activeDiagram]);

  const updateXmlBackground = (xmlStr: string, color: string): string => {
    if (!xmlStr) return xmlStr;
    const cleanColor = color === 'none' ? 'none' : color;
    if (xmlStr.includes('<mxGraphModel')) {
      if (xmlStr.includes('background=')) {
        return xmlStr.replace(/background="[^"]*"/, `background="${cleanColor}"`);
      } else {
        return xmlStr.replace('<mxGraphModel', `<mxGraphModel background="${cleanColor}"`);
      }
    }
    return xmlStr;
  };

  const handleBgColorChange = (newColor: string) => {
    setBgColor(newColor);
    const updatedXml = updateXmlBackground(currentXml, newColor);
    setCurrentXml(updatedXml);

    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        action: 'load',
        xml: updatedXml || '',
        bg: newColor === 'none' ? 'transparent' : newColor,
      }),
      '*'
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (evt: MessageEvent) => {
      if (!evt.data || typeof evt.data !== 'string') return;
      try {
        const msg = JSON.parse(evt.data);

        if (msg.event === 'init') {
          // Initialize Draw.io iframe with diagram XML & background color
          const xmlWithBg = updateXmlBackground(currentXml, bgColor);
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({
              action: 'load',
              xml: xmlWithBg || '',
              bg: bgColor === 'none' ? 'transparent' : bgColor
            }),
            '*'
          );
        } else if (msg.event === 'save') {
          // Received save event from Draw.io
          const xml = msg.xml || '';
          const rawSvg = msg.svg || msg.data || '';
          const svg = normalizeSvgContent(rawSvg);
          setCurrentXml(xml);

          onSaveDiagram({
            id: activeDiagram?.id || 'diagram-' + Date.now(),
            title: diagramTitle,
            xml,
            svg,
            bgColor,
            updatedAt: new Date().toISOString(),
          });

          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2500);
        } else if (msg.event === 'export') {
          // Received export SVG format
          const rawSvg = msg.data || msg.svg || '';
          const xml = msg.xml || currentXml;
          const svg = normalizeSvgContent(rawSvg);
          onSaveDiagram({
            id: activeDiagram?.id || 'diagram-' + Date.now(),
            title: diagramTitle,
            xml,
            svg,
            bgColor,
            updatedAt: new Date().toISOString(),
          });
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2500);
        }
      } catch (err) {
        // Ignore non-JSON postMessages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, currentXml, diagramTitle, activeDiagram, bgColor]);

  if (!isOpen) return null;

  const handleManualSave = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ action: 'export', format: 'xmlsvg' }),
      '*'
    );
  };

  const handleReloadIframe = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col p-4 animate-in fade-in duration-200 backdrop-blur-md ${
      isDark ? 'bg-slate-950/90' : 'bg-slate-900/40'
    }`}>
      {/* Draw.io Header Toolbar */}
      <div className={`h-14 border rounded-t-2xl px-6 flex items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={diagramTitle}
                onChange={(e) => setDiagramTitle(e.target.value)}
                className={`px-2 py-0.5 border rounded font-semibold text-sm focus:outline-none focus:border-amber-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded border border-amber-500/30 font-medium">
                Draw.io Engine
              </span>
            </div>
            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Integrated Flowchart & Architecture Diagrammer</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {savedSuccess && (
            <span className="flex items-center space-x-1 text-xs text-emerald-500 font-medium animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>Diagram Saved & Sync'd to Canvas!</span>
            </span>
          )}

          {/* Background Color Quick Selector Popover */}
          <div className="relative">
            <button
              onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
              title="Change Canvas Background Color"
            >
              <Palette className="w-3.5 h-3.5 text-amber-500" />
              <span>Background:</span>
              <div 
                className="w-4 h-4 rounded-full border border-slate-400 shadow-inner"
                style={{ backgroundColor: bgColor === 'none' ? 'transparent' : bgColor }}
              />
              <span className="font-mono text-[11px] opacity-80 uppercase">
                {bgColor === 'none' ? 'Transparent' : bgColor}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isColorMenuOpen && (
              <div className={`absolute right-0 mt-2 w-64 p-3 rounded-xl border shadow-xl z-50 animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/50">
                  <span className="text-xs font-semibold flex items-center space-x-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>Diagram Background</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Presets & Custom</span>
                </div>

                {/* Preset Swatches */}
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  {BG_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        handleBgColorChange(preset.value);
                        setIsColorMenuOpen(false);
                      }}
                      title={preset.name}
                      className={`group relative h-7 rounded-md flex items-center justify-center transition-transform hover:scale-105 ${preset.colorClass} ${
                        bgColor === preset.value ? 'ring-2 ring-amber-500 ring-offset-1 ring-offset-slate-900' : ''
                      }`}
                    >
                      {bgColor === preset.value && (
                        <Check className={`w-3.5 h-3.5 ${preset.value === '#ffffff' || preset.value === '#f8fafc' || preset.value === '#fefcbf' ? 'text-slate-900' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Hex / Color Input */}
                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between space-x-2">
                  <span className="text-xs text-slate-400">Custom Color:</span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="color"
                      value={bgColor === 'none' ? '#0f172a' : bgColor}
                      onChange={(e) => handleBgColorChange(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-none bg-transparent"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => handleBgColorChange(e.target.value)}
                      placeholder="#0f172a or none"
                      className={`w-24 px-2 py-1 text-xs font-mono rounded border ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleReloadIframe}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Reload Draw.io Editor"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          <button
            onClick={handleManualSave}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Sync to Canvas</span>
          </button>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Draw.io Embed Iframe Container */}
      <div className={`flex-1 border-x border-b rounded-b-2xl overflow-hidden relative ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <iframe
          key={`drawio-iframe-${themeMode}`}
          ref={iframeRef}
          src={`https://embed.diagrams.net/?embed=1&spin=1&modified=unsaved&proto=json&ui=min&dark=${isDark ? '1' : '0'}`}
          title="Draw.io Embedded Diagram Editor"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};
