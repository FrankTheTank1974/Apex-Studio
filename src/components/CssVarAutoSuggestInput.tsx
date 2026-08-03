import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, Check, ChevronDown, Palette, Type } from 'lucide-react';

export interface DiscoveredCssVariable {
  name: string;        // e.g. "--primary-color"
  value: string;       // e.g. "#6366f1"
  varRef: string;      // e.g. "var(--primary-color)"
  sourceFile?: string; // e.g. "styles.css"
  isColor?: boolean;
}

interface CssVarAutoSuggestInputProps {
  value: string;
  onChange: (value: string) => void;
  availableVars: DiscoveredCssVariable[];
  placeholder?: string;
  isDark?: boolean;
  typeFilter?: 'color' | 'font' | 'all';
  colorPickerValue?: string;
  onColorPickerChange?: (newHex: string) => void;
  presetOptions?: { label: string; value: string }[];
  label?: string;
}

export const CssVarAutoSuggestInput: React.FC<CssVarAutoSuggestInputProps> = ({
  value,
  onChange,
  availableVars,
  placeholder = 'e.g. #6366f1 or var(--primary-color)',
  isDark = true,
  typeFilter = 'all',
  colorPickerValue,
  onColorPickerChange,
  presetOptions,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter variables based on user typing and typeFilter
  const filteredVars = useMemo(() => {
    let list = availableVars;

    // Filter by type if specified
    if (typeFilter === 'color') {
      list = list.filter((v) => v.isColor || v.name.includes('color') || v.name.includes('bg') || v.name.includes('surface') || v.name.includes('border'));
    } else if (typeFilter === 'font') {
      list = list.filter((v) => !v.isColor || v.name.includes('font') || v.name.includes('family'));
    }

    const query = inputValue.toLowerCase().trim();
    if (!query) return list;

    return list.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.value.toLowerCase().includes(query) ||
        v.varRef.toLowerCase().includes(query)
    );
  }, [availableVars, inputValue, typeFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    onChange(newVal);
    setIsOpen(true);
  };

  const handleSelectVar = (varItem: DiscoveredCssVariable, mode: 'varRef' | 'value') => {
    const selectedText = mode === 'varRef' ? varItem.varRef : varItem.value;
    setInputValue(selectedText);
    onChange(selectedText);
    setIsOpen(false);
  };

  const handleSelectPreset = (presetVal: string) => {
    setInputValue(presetVal);
    onChange(presetVal);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className={`text-[10px] font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {label}
        </label>
      )}

      <div className="flex items-center space-x-1.5">
        {/* Optional Color Picker Swatch Box */}
        {onColorPickerChange && (
          <input
            type="color"
            value={colorPickerValue && /^#[0-9a-f]{6}$/i.test(colorPickerValue) ? colorPickerValue : '#6366f1'}
            onChange={(e) => {
              onColorPickerChange(e.target.value);
              setInputValue(e.target.value);
            }}
            className="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent shrink-0"
            title="Pick color"
          />
        )}

        {/* Value Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`w-full px-2 py-1.5 text-[11px] font-mono border rounded-lg pr-7 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-white transition-colors`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Auto-Suggest Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-1 z-50 rounded-xl border shadow-2xl overflow-hidden max-h-60 flex flex-col font-sans text-xs ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {/* Panel Header */}
          <div className="px-2.5 py-1.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center space-x-1 font-semibold text-indigo-400">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Project CSS Variables Auto-Suggest</span>
            </span>
            <span>{filteredVars.length} found</span>
          </div>

          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {/* Standard Preset Font/Color Options if provided */}
            {presetOptions && presetOptions.length > 0 && (
              <div className="mb-1 pb-1 border-b border-slate-800 space-y-0.5">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5">
                  Standard Presets
                </div>
                {presetOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectPreset(opt.value)}
                    className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-mono flex items-center justify-between transition-colors ${
                      inputValue === opt.value
                        ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/50'
                        : isDark
                          ? 'hover:bg-slate-800 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    <span className="text-[9px] text-slate-500 truncate max-w-[100px]">{opt.value}</span>
                  </button>
                ))}
              </div>
            )}

            {/* CSS Variables List */}
            {filteredVars.length > 0 ? (
              filteredVars.map((v) => {
                const isSelected = inputValue === v.varRef || inputValue === v.value || inputValue === v.name;
                const isHexColor = /^#[0-9a-f]{3,8}$/i.test(v.value);

                return (
                  <div
                    key={v.name}
                    className={`p-1.5 rounded-lg border text-[11px] flex items-center justify-between transition-all group ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-700/80 text-indigo-200'
                        : isDark
                          ? 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/80 text-slate-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0 pr-2">
                      {/* Color Swatch or Type Indicator */}
                      {v.isColor || isHexColor ? (
                        <span
                          className="w-4 h-4 rounded-md border border-white/20 shadow-xs shrink-0 inline-block"
                          style={{ backgroundColor: v.value }}
                        />
                      ) : (
                        <Type className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-indigo-300 text-[11px] truncate">
                            {v.name}
                          </span>
                          {v.sourceFile && (
                            <span className="text-[9px] px-1 bg-slate-800 text-slate-400 rounded font-mono">
                              {v.sourceFile}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                          Value: {v.value}
                        </span>
                      </div>
                    </div>

                    {/* Quick Selection Buttons */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectVar(v, 'varRef')}
                        className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-mono font-semibold transition-colors shadow-xs"
                        title={`Insert ${v.varRef}`}
                      >
                        {v.varRef}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectVar(v, 'value')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                          isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                        }`}
                        title={`Insert raw value ${v.value}`}
                      >
                        Value
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-slate-400 text-[11px]">
                No matching CSS variables found for "{inputValue}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
