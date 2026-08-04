import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Tag,
  Search,
  Maximize2,
  Minimize2,
  AlertTriangle,
  FolderTree,
  X,
  Hash,
  FileText
} from 'lucide-react';
import { parseXmlToTree, XmlTreeNode, XmlTreeParseResult } from '../utils/xmlTreeParser';

interface XmlStructureExplorerProps {
  xmlContent: string;
  cursorOffset: number;
  onSelectNode: (startOffset: number) => void;
  onClose: () => void;
  isDark?: boolean;
}

export const XmlStructureExplorer: React.FC<XmlStructureExplorerProps> = ({
  xmlContent,
  cursorOffset,
  onSelectNode,
  onClose,
  isDark = true
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());

  // Parse XML into Tree model whenever content changes
  const treeResult: XmlTreeParseResult = useMemo(() => {
    return parseXmlToTree(xmlContent);
  }, [xmlContent]);

  // Handle expand/collapse toggle
  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setCollapsedNodeIds(new Set());
  };

  const handleCollapseAll = () => {
    if (!treeResult.rootNode) return;
    const allIds = new Set<string>();
    
    function collectChildIds(node: XmlTreeNode) {
      if (node.children.length > 0) {
        allIds.add(node.id);
        node.children.forEach(collectChildIds);
      }
    }
    collectChildIds(treeResult.rootNode);
    setCollapsedNodeIds(allIds);
  };

  // Helper to check if node matches search query
  const isNodeMatchingSearch = (node: XmlTreeNode, term: string): boolean => {
    if (!term) return true;
    const lower = term.toLowerCase();
    if (node.tagName.toLowerCase().includes(lower)) return true;
    if (node.textPreview && node.textPreview.toLowerCase().includes(lower)) return true;
    
    for (const [key, val] of Object.entries(node.attributes)) {
      if (key.toLowerCase().includes(lower) || val.toLowerCase().includes(lower)) {
        return true;
      }
    }

    return node.children.some((child) => isNodeMatchingSearch(child, term));
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: XmlTreeNode) => {
    const hasChildren = node.children.length > 0;
    const isCollapsed = collapsedNodeIds.has(node.id);
    const matchesFilter = isNodeMatchingSearch(node, searchTerm);

    if (searchTerm && !matchesFilter) return null;

    const attrEntries = Object.entries(node.attributes);

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => onSelectNode(node.startOffset)}
          className={`group flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
            isDark
              ? 'hover:bg-slate-800/80 border-transparent hover:border-slate-700/60 text-slate-200'
              : 'hover:bg-slate-100 border-transparent hover:border-slate-300 text-slate-800'
          }`}
          style={{ paddingLeft: `${Math.max(8, node.depth * 16 + 8)}px` }}
        >
          {/* Collapse / Expand Toggle Caret */}
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => toggleCollapse(node.id, e)}
              className="p-0.5 rounded hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors shrink-0 cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5 h-3.5 shrink-0" />
          )}

          {/* Node Tag Icon */}
          <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0 opacity-80 group-hover:opacity-100" />

          {/* Tag Name */}
          <span className="font-bold text-amber-300/90 group-hover:text-amber-300">
            &lt;{node.tagName}&gt;
          </span>

          {/* Attribute Pills */}
          {attrEntries.length > 0 && (
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none max-w-[140px]">
              {attrEntries.slice(0, 2).map(([k, v]) => (
                <span
                  key={k}
                  className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800/80 text-teal-300 border border-slate-700 shrink-0"
                >
                  {k}="{v}"
                </span>
              ))}
              {attrEntries.length > 2 && (
                <span className="text-[10px] text-slate-500 font-mono">
                  +{attrEntries.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Text Preview Badge */}
          {node.textPreview && (
            <span className="text-[10px] text-slate-400 truncate max-w-[120px] italic bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">
              "{node.textPreview}"
            </span>
          )}

          {/* Line Number Badge */}
          <span className="ml-auto text-[10px] text-slate-500 font-mono shrink-0 pl-1">
            L{node.line}
          </span>
        </div>

        {/* Child Nodes */}
        {hasChildren && !isCollapsed && (
          <div className="space-y-0.5">
            {node.children.map((childNode) => renderTreeNode(childNode))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`w-80 h-full border-l flex flex-col shrink-0 shadow-xl transition-all ${
      isDark ? 'bg-slate-950/95 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
    }`}>
      {/* Header */}
      <div className={`px-3.5 py-2.5 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center space-x-2">
          <FolderTree className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            XML Structure Explorer
          </h3>
          {treeResult.success && treeResult.totalNodes > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {treeResult.totalNodes} nodes
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleExpandAll}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Expand All Nodes"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Collapse All Nodes"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Close Explorer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="p-2 border-b border-slate-800/60 bg-slate-900/40">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter tags or attributes..."
            className={`w-full pl-8 pr-3 py-1 rounded-lg text-xs outline-none border transition-all ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-amber-500/60'
                : 'bg-white border-slate-300 text-slate-800 focus:border-amber-500'
            }`}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tree Content Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {!treeResult.success ? (
          <div className="p-4 text-center space-y-2">
            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
            <p className="text-xs text-red-400 font-mono font-medium">
              XML Parsing Error
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              {treeResult.error || 'Fix XML syntax errors to display structure tree.'}
            </p>
          </div>
        ) : !treeResult.rootNode ? (
          <div className="p-6 text-center text-xs text-slate-500 italic">
            XML document is empty.
          </div>
        ) : (
          renderTreeNode(treeResult.rootNode)
        )}
      </div>
    </div>
  );
};
