import React, { useState } from 'react';
import { 
  COMPONENT_TEMPLATES 
} from '../data/componentsData';
import { ComponentCategory, ComponentTemplate, ThemeMode } from '../types';
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
  Table
} from 'lucide-react';

interface ComponentLibraryProps {
  onInsertComponent: (html: string) => void;
  onDragStartComponent?: (e: React.DragEvent, component: ComponentTemplate) => void;
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
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = COMPONENT_TEMPLATES.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
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
      default: return <Code className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`w-72 border-r flex flex-col h-full select-none transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
    }`}>
      {/* Header & Search */}
      <div className={`p-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Component Palette
          </span>
          <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Drag to Canvas
          </span>
        </div>
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition-colors ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Categories Horizontal Pills */}
      <div className={`flex items-center space-x-1 p-2 overflow-x-auto border-b scrollbar-none text-xs ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white'
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
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredComponents.length === 0 ? (
          <div className={`text-center py-8 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No matching components found.
          </div>
        ) : (
          filteredComponents.map((comp) => (
            <div
              key={comp.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/html', comp.html);
                e.dataTransfer.setData('text/plain', comp.html);
                if (onDragStartComponent) onDragStartComponent(e, comp);
              }}
              className={`group p-3 border rounded-xl transition-all cursor-grab active:cursor-grabbing shadow-sm ${
                isDark
                  ? 'bg-slate-950 hover:bg-slate-800/80 border-slate-800/80 hover:border-indigo-500/50'
                  : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg border ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    {getIcon(comp.icon)}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold transition-colors ${
                      isDark ? 'text-slate-100 group-hover:text-indigo-300' : 'text-slate-800 group-hover:text-indigo-600'
                    }`}>
                      {comp.name}
                    </h4>
                    <span className={`text-[10px] capitalize ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{comp.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => onInsertComponent(comp.html)}
                  className="opacity-0 group-hover:opacity-100 p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-opacity"
                  title="Insert into Canvas"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {comp.description}
              </p>

              <div className={`mt-2 flex items-center justify-between text-[10px] pt-2 border-t ${
                isDark ? 'text-slate-500 border-slate-800/60' : 'text-slate-400 border-slate-200'
              }`}>
                <span className="flex items-center space-x-1">
                  <GripVertical className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  <span>Drag to canvas</span>
                </span>
                <span className="text-indigo-500 font-mono font-medium">Tailwind Ready</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
