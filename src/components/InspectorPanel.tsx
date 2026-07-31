import React, { useState, useEffect } from 'react';
import { SelectedElementInfo, ThemeMode } from '../types';
import { 
  Type, 
  Palette, 
  Box, 
  Maximize2, 
  Layers, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Sliders, 
  Sparkles,
  Check,
  Workflow
} from 'lucide-react';

interface InspectorPanelProps {
  selectedElement: SelectedElementInfo | null;
  onUpdateElement: (updatedInfo: Partial<SelectedElementInfo>) => void;
  onDuplicateElement: () => void;
  onDeleteElement: () => void;
  onMoveElement: (direction: 'up' | 'down') => void;
  onOpenDrawIoWithDiagram?: (diagramId?: string) => void;
  themeMode?: ThemeMode;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveElement,
  onOpenDrawIoWithDiagram,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  if (!selectedElement) {
    return (
      <div className={`w-80 border-l p-6 flex flex-col items-center justify-center text-center text-xs transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <Sliders className={`w-8 h-8 mb-3 stroke-1 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
        <p className={`font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>No Element Selected</p>
        <p className={`max-w-[200px] leading-relaxed ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
          Click on any text, button, container or image in the visual canvas to inspect and edit its styles & HTML attributes.
        </p>
      </div>
    );
  }

  const [textContent, setTextContent] = useState(selectedElement.textContent || '');
  const [classList, setClassList] = useState(selectedElement.classList?.join(' ') || '');
  const [newClass, setNewClass] = useState('');
  const [attributes, setAttributes] = useState<Record<string, string>>(selectedElement.attributes || {});

  useEffect(() => {
    setTextContent(selectedElement.textContent || '');
    setClassList(selectedElement.classList?.join(' ') || '');
    setAttributes(selectedElement.attributes || {});
  }, [selectedElement]);

  const handleApplyText = () => {
    onUpdateElement({ textContent });
  };

  const handleApplyClasses = (classesStr: string) => {
    const newArr = classesStr.split(' ').filter(Boolean);
    setClassList(classesStr);
    onUpdateElement({ classList: newArr });
  };

  const handleAddQuickClass = (className: string) => {
    const current = classList.split(' ').filter(Boolean);
    if (!current.includes(className)) {
      const updated = [...current, className].join(' ');
      handleApplyClasses(updated);
    }
  };

  const handleRemoveClass = (cls: string) => {
    const updated = classList.split(' ').filter((c) => c !== cls).join(' ');
    handleApplyClasses(updated);
  };

  const handleAttributeChange = (key: string, value: string) => {
    const updated = { ...attributes, [key]: value };
    setAttributes(updated);
    onUpdateElement({ attributes: updated });
  };

  const buttonPresetStyle = isDark
    ? 'p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center text-slate-300'
    : 'p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-center text-slate-700';

  return (
    <div className={`w-80 border-l flex flex-col h-full text-xs select-none transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {/* Header & Element Breadcrumb */}
      <div className={`p-3 border-b flex items-center justify-between ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-indigo-600/30 text-indigo-400 dark:text-indigo-300 rounded font-mono font-bold uppercase text-[11px]">
            &lt;{selectedElement.tagName.toLowerCase()}&gt;
          </span>
          <span className={`font-mono text-[11px] truncate max-w-[120px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {selectedElement.id ? `#${selectedElement.id}` : ''}
          </span>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onMoveElement('up')}
            className={`p-1 rounded ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMoveElement('down')}
            className={`p-1 rounded ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDuplicateElement}
            className={`p-1 rounded ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
            title="Duplicate Element"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDeleteElement}
            className="p-1 hover:bg-red-950/50 rounded text-red-400 hover:text-red-300"
            title="Delete Element (Del / Backspace)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Draw.io Embedded Diagram Helper */}
        {(selectedElement.classList?.includes('drawio-container') ||
          selectedElement.classList?.includes('diagram-title') ||
          selectedElement.classList?.includes('diagram-viewport') ||
          selectedElement.attributes?.['data-diagram-id']) && (
          <div className={`p-3 border rounded-xl space-y-2 ${
            isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center space-x-2">
              <Workflow className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-xs">Draw.io Diagram Block</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Rename the diagram by double-clicking title text directly on the canvas or using "Text Content" below.
            </p>
            {onOpenDrawIoWithDiagram && (
              <button
                type="button"
                onClick={() => {
                  const id = selectedElement.attributes?.['data-diagram-id'] || 'main-flow';
                  onOpenDrawIoWithDiagram(id);
                }}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Workflow className="w-3.5 h-3.5" />
                <span>Open Draw.io Canvas Editor</span>
              </button>
            )}
          </div>
        )}

        {/* TEXT CONTENT EDIT */}
        <div className="space-y-1.5">
          <div className={`flex items-center justify-between font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="flex items-center space-x-1">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>Text Content</span>
            </span>
          </div>
          <textarea
            rows={2}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            onBlur={handleApplyText}
            placeholder="Inner text content..."
            className={`w-full p-2 border rounded-lg font-mono text-[11px] focus:outline-none focus:border-indigo-500 transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />
        </div>

        {/* TAILWIND & CSS CLASSES MANAGER */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span>Tailwind CSS Classes</span>
            </span>
          </div>

          {/* Active Class Chips */}
          <div className={`flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 border rounded-lg ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            {classList.split(' ').filter(Boolean).map((cls, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono group ${
                  isDark ? 'bg-slate-800 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}
              >
                <span>{cls}</span>
                <button
                  onClick={() => handleRemoveClass(cls)}
                  className="text-slate-400 hover:text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-1">
            <input
              type="text"
              placeholder="Add class e.g. bg-indigo-600"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newClass.trim()) {
                  handleAddQuickClass(newClass.trim());
                  setNewClass('');
                }
              }}
              className={`flex-1 px-2.5 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            />
            <button
              onClick={() => {
                if (newClass.trim()) {
                  handleAddQuickClass(newClass.trim());
                  setNewClass('');
                }
              }}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px]"
            >
              Add
            </button>
          </div>
        </div>

        {/* QUICK STYLE PRESET BUTTONS */}
        <div className="space-y-2">
          <span className={`font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Visual Styles</span>
          </span>

          {/* Typography Presets */}
          <div className="space-y-1">
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Text Size & Weight</span>
            <div className="grid grid-cols-4 gap-1">
              <button onClick={() => handleAddQuickClass('text-xs')} className={buttonPresetStyle}>xs</button>
              <button onClick={() => handleAddQuickClass('text-sm')} className={buttonPresetStyle}>sm</button>
              <button onClick={() => handleAddQuickClass('text-xl')} className={buttonPresetStyle}>xl</button>
              <button onClick={() => handleAddQuickClass('text-3xl')} className={buttonPresetStyle}>3xl</button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => handleAddQuickClass('font-normal')} className={buttonPresetStyle}>Normal</button>
              <button onClick={() => handleAddQuickClass('font-semibold')} className={buttonPresetStyle}>Semibold</button>
              <button onClick={() => handleAddQuickClass('font-extrabold')} className={buttonPresetStyle}>Bold</button>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-1">
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Color Highlights</span>
            <div className="grid grid-cols-5 gap-1">
              <button onClick={() => handleAddQuickClass('bg-indigo-600')} className="h-6 bg-indigo-600 rounded border border-indigo-400" title="Indigo BG" />
              <button onClick={() => handleAddQuickClass('bg-emerald-600')} className="h-6 bg-emerald-600 rounded border border-emerald-400" title="Emerald BG" />
              <button onClick={() => handleAddQuickClass('bg-purple-600')} className="h-6 bg-purple-600 rounded border border-purple-400" title="Purple BG" />
              <button onClick={() => handleAddQuickClass('bg-amber-600')} className="h-6 bg-amber-600 rounded border border-amber-400" title="Amber BG" />
              <button onClick={() => handleAddQuickClass('bg-slate-900')} className="h-6 bg-slate-900 rounded border border-slate-700" title="Dark BG" />
            </div>
          </div>

          {/* Spacing & Rounded Presets */}
          <div className="space-y-1">
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Border Radius & Padding</span>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => handleAddQuickClass('rounded-none')} className={buttonPresetStyle}>Square</button>
              <button onClick={() => handleAddQuickClass('rounded-xl')} className={buttonPresetStyle}>Rounded</button>
              <button onClick={() => handleAddQuickClass('rounded-full')} className={buttonPresetStyle}>Pill</button>
            </div>
          </div>
        </div>

        {/* HTML ATTRIBUTES EDIT */}
        <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <span className={`font-semibold flex items-center space-x-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Box className="w-3.5 h-3.5 text-cyan-500" />
            <span>Attributes (ID, Href, Src, Alt)</span>
          </span>

          <div className="space-y-1.5">
            <div>
              <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Element ID</label>
              <input
                type="text"
                value={attributes.id || ''}
                onChange={(e) => handleAttributeChange('id', e.target.value)}
                placeholder="e.g. hero-title"
                className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 font-mono ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            {selectedElement.tagName.toLowerCase() === 'a' && (
              <div>
                <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Href URL</label>
                <input
                  type="text"
                  value={attributes.href || ''}
                  onChange={(e) => handleAttributeChange('href', e.target.value)}
                  placeholder="https://..."
                  className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            )}
            {selectedElement.tagName.toLowerCase() === 'img' && (
              <>
                <div>
                  <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Image Source (src)</label>
                  <input
                    type="text"
                    value={attributes.src || ''}
                    onChange={(e) => handleAttributeChange('src', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Alt Text</label>
                  <input
                    type="text"
                    value={attributes.alt || ''}
                    onChange={(e) => handleAttributeChange('alt', e.target.value)}
                    placeholder="Image description"
                    className={`w-full px-2 py-1 border rounded text-[11px] focus:outline-none focus:border-indigo-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
