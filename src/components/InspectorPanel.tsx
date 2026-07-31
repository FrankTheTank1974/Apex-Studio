import React, { useState, useEffect } from 'react';
import { SelectedElementInfo } from '../types';
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
  Check
} from 'lucide-react';

interface InspectorPanelProps {
  selectedElement: SelectedElementInfo | null;
  onUpdateElement: (updatedInfo: Partial<SelectedElementInfo>) => void;
  onDuplicateElement: () => void;
  onDeleteElement: () => void;
  onMoveElement: (direction: 'up' | 'down') => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveElement,
}) => {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
        <Sliders className="w-8 h-8 mb-3 text-slate-700 stroke-1" />
        <p className="font-semibold text-slate-400 mb-1">No Element Selected</p>
        <p className="max-w-[200px] leading-relaxed">
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

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-slate-300 text-xs select-none">
      {/* Header & Element Breadcrumb */}
      <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-indigo-600/30 text-indigo-300 rounded font-mono font-bold uppercase text-[11px]">
            &lt;{selectedElement.tagName.toLowerCase()}&gt;
          </span>
          <span className="font-mono text-slate-400 text-[11px] truncate max-w-[120px]">
            {selectedElement.id ? `#${selectedElement.id}` : ''}
          </span>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onMoveElement('up')}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMoveElement('down')}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDuplicateElement}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
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
        {/* TEXT CONTENT EDIT */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 font-semibold">
            <span className="flex items-center space-x-1">
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              <span>Text Content</span>
            </span>
          </div>
          <textarea
            rows={2}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            onBlur={handleApplyText}
            placeholder="Inner text content..."
            className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* TAILWIND & CSS CLASSES MANAGER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-semibold">
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Tailwind CSS Classes</span>
            </span>
          </div>

          {/* Active Class Chips */}
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-slate-950 border border-slate-800 rounded-lg">
            {classList.split(' ').filter(Boolean).map((cls, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-slate-800 text-indigo-300 rounded text-[10px] font-mono group"
              >
                <span>{cls}</span>
                <button
                  onClick={() => handleRemoveClass(cls)}
                  className="text-slate-500 hover:text-red-400 font-bold ml-1"
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
              className="flex-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-white text-[11px] focus:outline-none focus:border-indigo-500"
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
          <span className="text-slate-400 font-semibold flex items-center space-x-1">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Visual Styles</span>
          </span>

          {/* Typography Presets */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Text Size & Weight</span>
            <div className="grid grid-cols-4 gap-1">
              <button onClick={() => handleAddQuickClass('text-xs')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center">xs</button>
              <button onClick={() => handleAddQuickClass('text-sm')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center">sm</button>
              <button onClick={() => handleAddQuickClass('text-xl')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center">xl</button>
              <button onClick={() => handleAddQuickClass('text-3xl')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center">3xl</button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => handleAddQuickClass('font-normal')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center">Normal</button>
              <button onClick={() => handleAddQuickClass('font-semibold')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center">Semibold</button>
              <button onClick={() => handleAddQuickClass('font-extrabold')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px] text-center">Bold</button>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Color Highlights</span>
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
            <span className="text-[10px] text-slate-500">Border Radius & Padding</span>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => handleAddQuickClass('rounded-none')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px]">Square</button>
              <button onClick={() => handleAddQuickClass('rounded-xl')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px]">Rounded</button>
              <button onClick={() => handleAddQuickClass('rounded-full')} className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-[10px]">Pill</button>
            </div>
          </div>
        </div>

        {/* HTML ATTRIBUTES EDIT */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-slate-400 font-semibold flex items-center space-x-1">
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>Attributes (ID, Href, Src, Alt)</span>
          </span>

          <div className="space-y-1.5">
            <div>
              <label className="text-[10px] text-slate-500">Element ID</label>
              <input
                type="text"
                value={attributes.id || ''}
                onChange={(e) => handleAttributeChange('id', e.target.value)}
                placeholder="e.g. hero-title"
                className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-[11px] focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            {selectedElement.tagName.toLowerCase() === 'a' && (
              <div>
                <label className="text-[10px] text-slate-500">Href URL</label>
                <input
                  type="text"
                  value={attributes.href || ''}
                  onChange={(e) => handleAttributeChange('href', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-[11px] focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
            {selectedElement.tagName.toLowerCase() === 'img' && (
              <>
                <div>
                  <label className="text-[10px] text-slate-500">Image Source (src)</label>
                  <input
                    type="text"
                    value={attributes.src || ''}
                    onChange={(e) => handleAttributeChange('src', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-[11px] focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500">Alt Text</label>
                  <input
                    type="text"
                    value={attributes.alt || ''}
                    onChange={(e) => handleAttributeChange('alt', e.target.value)}
                    placeholder="Image description"
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-white text-[11px] focus:outline-none focus:border-indigo-500"
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
