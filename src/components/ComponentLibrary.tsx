import React, { useState } from 'react';
import { 
  COMPONENT_TEMPLATES 
} from '../data/componentsData';
import { ComponentCategory, ComponentTemplate, ComponentVariant, ThemeMode } from '../types';
import { ComponentHoverPreviewCard } from './ComponentHoverPreviewCard';
import { 
  Search, 
  Sparkles, 
  Navigation, 
  LayoutGrid, 
  PanelBottom, 
  SquareMousePointer, 
  CreditCard, 
  Tag, 
  Mail, 
  Workflow, 
  Code,
  Film,
  Plus,
  GripVertical,
  MoveHorizontal,
  Clock,
  Timer,
  Globe,
  FileText,
  Table,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Eye,
  Smile,
  Music,
  Headphones,
  Volume2
} from 'lucide-react';

interface ComponentLibraryProps {
  onInsertComponent: (html: string) => void;
  onDragStartComponent?: (e: React.DragEvent, component: ComponentTemplate, variant?: ComponentVariant) => void;
  onOpenIconPicker?: () => void;
  themeMode?: ThemeMode;
}

const CATEGORIES: { id: ComponentCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'layout', label: 'Layout' },
  { id: 'ui', label: 'UI Controls' },
  { id: 'media', label: 'Media & Video' },
  { id: 'forms', label: 'Forms' },
  { id: 'drawio', label: 'Draw.io' },
  { id: 'custom', label: 'Code Blocks' },
];

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onInsertComponent,
  onDragStartComponent,
  onOpenIconPicker,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track active variant per component template
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  // Track expanded variant drawer state per component template
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});
  // Track hover preview state for visual component layout thumbnail cards
  const [hoveredPreview, setHoveredPreview] = useState<{
    component: ComponentTemplate;
    variant?: ComponentVariant;
    posY: number;
  } | null>(null);

  const filteredComponents = COMPONENT_TEMPLATES.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesTemplateSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVariantSearch = c.variants?.some((v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCategory && (matchesTemplateSearch || matchesVariantSearch);
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case 'Navigation': return <Navigation className="w-4 h-4 text-blue-400" />;
      case 'LayoutGrid': return <LayoutGrid className="w-4 h-4 text-purple-400" />;
      case 'PanelBottom': return <PanelBottom className="w-4 h-4 text-slate-400" />;
      case 'SquareMousePointer': return <SquareMousePointer className="w-4 h-4 text-emerald-400" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'Tag': return <Tag className="w-4 h-4 text-pink-400" />;
      case 'Mail': return <Mail className="w-4 h-4 text-cyan-400" />;
      case 'Workflow': return <Workflow className="w-4 h-4 text-amber-400" />;
      case 'Film': return <Film className="w-4 h-4 text-purple-400" />;
      case 'MoveHorizontal': return <MoveHorizontal className="w-4 h-4 text-cyan-400" />;
      case 'Clock': return <Clock className="w-4 h-4 text-emerald-400" />;
      case 'Timer': return <Timer className="w-4 h-4 text-amber-400" />;
      case 'Globe': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'FileText': return <FileText className="w-4 h-4 text-indigo-400" />;
      case 'Table': return <Table className="w-4 h-4 text-emerald-400" />;
      case 'Music': return <Music className="w-4 h-4 text-indigo-400" />;
      case 'Headphones': return <Headphones className="w-4 h-4 text-purple-400" />;
      case 'Volume2': return <Volume2 className="w-4 h-4 text-cyan-400" />;
      default: return <Code className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`w-80 shrink-0 border-r flex flex-col h-full select-none z-10 relative transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {/* Header & Search */}
      <div className={`p-3 border-b shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Component Palette
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              VARIANTS
            </span>
          </div>
          <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Drag to Canvas
          </span>
        </div>
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search components or variants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-colors ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Icon Picker Quick Action Button */}
        {onOpenIconPicker && (
          <button
            onClick={onOpenIconPicker}
            className="mt-2 w-full py-1.5 px-3 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-semibold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center space-x-2">
              <Smile className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-12 transition-transform" />
              <span>Icon Picker Studio</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 uppercase">
              Browse Icons
            </span>
          </button>
        )}
      </div>

      {/* Categories Wrapped Pills */}
      <div className={`flex flex-wrap gap-1 p-2 border-b text-xs shrink-0 ${
        isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/50'
      }`}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-2xs'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredComponents.length === 0 ? (
          <div className={`text-center py-8 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No matching components or variants found.
          </div>
        ) : (
          filteredComponents.map((comp) => {
            const hasVariants = comp.variants && comp.variants.length > 0;
            const activeVariantId = selectedVariants[comp.id] || (hasVariants ? comp.variants![0].id : undefined);
            const activeVariant = hasVariants ? comp.variants!.find((v) => v.id === activeVariantId) || comp.variants![0] : undefined;
            const activeHtml = activeVariant ? activeVariant.html : comp.html;
            const activeDescription = activeVariant ? activeVariant.description : comp.description;
            const activeVariantName = activeVariant ? activeVariant.name : comp.name;
            const isExpanded = !!expandedVariants[comp.id];

            return (
              <div
                key={comp.id}
                draggable
                onDragStart={(e) => {
                  setHoveredPreview(null);
                  e.dataTransfer.setData('text/html', activeHtml);
                  e.dataTransfer.setData('text/plain', activeHtml);
                  if (onDragStartComponent) onDragStartComponent(e, comp, activeVariant);
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoveredPreview({
                    component: comp,
                    variant: activeVariant,
                    posY: rect.top
                  });
                }}
                onMouseLeave={() => {
                  setHoveredPreview(null);
                }}
                className={`group p-3 border rounded-xl transition-all cursor-grab active:cursor-grabbing shadow-sm relative ${
                  isDark
                    ? 'bg-slate-950 hover:bg-slate-900/90 border-slate-800/80 hover:border-indigo-500/50'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-indigo-500/40'
                }`}
              >
                {/* Top Title & Actions */}
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      {getIcon(comp.icon)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className={`text-xs font-semibold transition-colors ${
                          isDark ? 'text-slate-100 group-hover:text-indigo-300' : 'text-slate-800 group-hover:text-indigo-600'
                        }`}>
                          {comp.name}
                        </h4>
                        {hasVariants && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center space-x-0.5">
                            <Layers className="w-2.5 h-2.5" />
                            <span>{comp.variants!.length} Var</span>
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] capitalize ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {comp.category} {activeVariant ? `• ${activeVariant.name}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Hover Preview Indicator Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredPreview({
                          component: comp,
                          variant: activeVariant,
                          posY: rect.top
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-indigo-400 rounded hover:bg-slate-800/50 transition-colors cursor-pointer"
                      title="Preview Component Snapshot"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInsertComponent(activeHtml);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-opacity cursor-pointer shadow-xs"
                      title={`Insert ${activeVariantName} into Canvas`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Variant Selection Tabs / Pills (If component has variants) */}
                {hasVariants && (
                  <div className="mt-2 mb-2">
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className={`font-semibold flex items-center space-x-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        <Layers className="w-3 h-3" />
                        <span>Select Variant Style:</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedVariants((prev) => ({ ...prev, [comp.id]: !prev[comp.id] }));
                        }}
                        className={`text-[10px] flex items-center space-x-0.5 font-medium underline transition-colors cursor-pointer ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title="Toggle all variant sub-cards"
                      >
                        <span>{isExpanded ? 'Hide All' : 'Show Cards'}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Variant Selector Horizontal Pills */}
                    <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
                      {comp.variants!.map((v) => {
                        const isSelected = v.id === activeVariantId;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredPreview({
                                component: comp,
                                variant: v,
                                posY: rect.top
                              });
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariants((prev) => ({ ...prev, [comp.id]: v.id }));
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredPreview({
                                component: comp,
                                variant: v,
                                posY: rect.top
                              });
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                                : isDark
                                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {activeDescription}
                </p>

                {/* Expanded Individual Variant Cards Drawer */}
                {hasVariants && isExpanded && (
                  <div className={`mt-2.5 pt-2.5 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Drag Specific Variant Card:
                    </div>
                    {comp.variants!.map((v) => {
                      const isSelected = v.id === activeVariantId;
                      return (
                        <div
                          key={`expanded-${v.id}`}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            setHoveredPreview(null);
                            e.dataTransfer.setData('text/html', v.html);
                            e.dataTransfer.setData('text/plain', v.html);
                            if (onDragStartComponent) onDragStartComponent(e, comp, v);
                          }}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredPreview({
                              component: comp,
                              variant: v,
                              posY: rect.top
                            });
                          }}
                          onClick={() => setSelectedVariants((prev) => ({ ...prev, [comp.id]: v.id }))}
                          className={`p-2 rounded-lg border text-xs transition-all cursor-grab active:cursor-grabbing flex items-center justify-between ${
                            isSelected
                              ? isDark
                                ? 'bg-indigo-950/50 border-indigo-500/60 text-white'
                                : 'bg-indigo-50 border-indigo-300 text-slate-900'
                              : isDark
                                ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2 overflow-hidden">
                            <GripVertical className={`w-3 h-3 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            <div className="truncate">
                              <div className="font-semibold text-[11px] flex items-center space-x-1">
                                <span>{v.name}</span>
                                {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                              </div>
                              <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {v.description}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onInsertComponent(v.html);
                            }}
                            className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded shrink-0 cursor-pointer"
                            title={`Insert ${v.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer status bar */}
                <div className={`mt-2 flex items-center justify-between text-[10px] pt-2 border-t ${
                  isDark ? 'text-slate-500 border-slate-800/60' : 'text-slate-400 border-slate-200'
                }`}>
                  <span className="flex items-center space-x-1">
                    <GripVertical className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                    <span>Drag {hasVariants ? 'active variant' : 'to canvas'}</span>
                  </span>
                  <span className="text-indigo-500 font-mono font-medium flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>Hover Preview</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Hover Preview Floating Card */}
      {hoveredPreview && (
        <ComponentHoverPreviewCard
          component={hoveredPreview.component}
          variant={hoveredPreview.variant}
          onInsert={(html) => {
            onInsertComponent(html);
            setHoveredPreview(null);
          }}
          isDark={isDark}
          positionY={hoveredPreview.posY}
        />
      )}
    </div>
  );
};
