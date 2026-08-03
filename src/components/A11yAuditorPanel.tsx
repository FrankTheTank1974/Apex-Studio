import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Wand2,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Eye,
  Check,
  FileCode,
  Zap,
  Filter
} from 'lucide-react';
import { ThemeMode, ProjectFile } from '../types';
import {
  auditHtmlAccessibility,
  applyA11yQuickFix,
  A11yAuditReport,
  A11yIssue
} from '../utils/a11yAuditor';

interface A11yAuditorPanelProps {
  files?: ProjectFile[];
  activeHtmlContent?: string;
  onUpdateHtmlContent?: (newHtml: string) => void;
  themeMode?: ThemeMode;
}

export const A11yAuditorPanel: React.FC<A11yAuditorPanelProps> = ({
  files = [],
  activeHtmlContent = '',
  onUpdateHtmlContent,
  themeMode = 'dark'
}) => {
  const isDark = themeMode === 'dark';

  // Active HTML string resolution
  const currentHtmlContent = useMemo(() => {
    if (activeHtmlContent) return activeHtmlContent;
    const indexHtml = files.find((f) => f.name === 'index.html' || f.type === 'html');
    return indexHtml?.content || '';
  }, [activeHtmlContent, files]);

  // Selected Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const [fixedIssueIds, setFixedIssueIds] = useState<Set<string>>(new Set());
  const [fixNotification, setFixNotification] = useState<string | null>(null);

  // Run Realtime Audit
  const report: A11yAuditReport = useMemo(() => {
    return auditHtmlAccessibility(currentHtmlContent);
  }, [currentHtmlContent]);

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return report.issues.filter((issue) => {
      if (selectedCategory !== 'All' && issue.category !== selectedCategory) return false;
      if (filterSeverity !== 'all' && issue.severity !== filterSeverity) return false;
      return true;
    });
  }, [report.issues, selectedCategory, filterSeverity]);

  // Individual Fix Handler
  const handleFixIssue = (issue: A11yIssue) => {
    if (!onUpdateHtmlContent) return;

    const updatedHtml = applyA11yQuickFix(currentHtmlContent, issue);
    onUpdateHtmlContent(updatedHtml);

    setFixedIssueIds((prev) => new Set(prev).add(issue.id));
    setFixNotification(`Fixed "${issue.title}" automatically!`);
    setTimeout(() => setFixNotification(null), 3000);
  };

  // Batch Fix All Fixable Issues
  const handleBatchFixAll = () => {
    if (!onUpdateHtmlContent) return;

    let updated = currentHtmlContent;
    let count = 0;

    for (const issue of report.issues) {
      if (issue.fixable) {
        updated = applyA11yQuickFix(updated, issue);
        count++;
      }
    }

    onUpdateHtmlContent(updated);
    setFixNotification(`Batch Auto-Fixed ${count} accessibility issue(s)!`);
    setTimeout(() => setFixNotification(null), 3500);
  };

  // Score color formatting
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      {/* Top Header Card */}
      <div
        className={`p-3.5 border-b flex flex-col space-y-3 ${
          isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-extrabold text-xs tracking-tight">Accessibility Auditor</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              WCAG 2.1 AA
            </span>
          </div>

          {/* Batch Fix Button */}
          {report.issues.some((i) => i.fixable) && (
            <button
              onClick={handleBatchFixAll}
              className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center space-x-1 transition-all cursor-pointer shrink-0"
              title="Automatically fix all fixable WCAG violations in active HTML"
            >
              <Wand2 className="w-3 h-3" />
              <span>Fix All ({report.issues.filter((i) => i.fixable).length})</span>
            </button>
          )}
        </div>

        {/* Score & Audit Metric Card */}
        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          {/* Score Circle Gauge */}
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center font-extrabold shadow-inner ${getScoreColorClass(report.score)}`}>
              <span className="text-sm font-mono leading-none">{report.score}</span>
              <span className="text-[8px] uppercase tracking-tighter opacity-80">Score</span>
            </div>
            <div>
              <div className="text-xs font-bold">
                {report.score >= 90
                  ? 'Excellent WCAG Compliance'
                  : report.score >= 70
                  ? 'Needs Accessibility Polish'
                  : 'Critical A11y Violations'}
              </div>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {report.issues.length === 0
                  ? 'All accessibility automated checks passed!'
                  : `${report.issues.length} violation(s) detected in HTML content.`}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown Metric Badges */}
        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
          <button
            onClick={() => setFilterSeverity(filterSeverity === 'error' ? 'all' : 'error')}
            className={`py-1 px-2 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
              filterSeverity === 'error'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              <span>Errors</span>
            </span>
            <span className="font-mono text-rose-400">{report.errorCount}</span>
          </button>

          <button
            onClick={() => setFilterSeverity(filterSeverity === 'warning' ? 'all' : 'warning')}
            className={`py-1 px-2 rounded-lg border flex items-center justify-between transition-colors cursor-pointer ${
              filterSeverity === 'warning'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : isDark
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Warnings</span>
            </span>
            <span className="font-mono text-amber-400">{report.warningCount}</span>
          </button>

          <div
            className={`py-1 px-2 rounded-lg border flex items-center justify-between ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Passed</span>
            </span>
            <span className="font-mono text-emerald-400">{report.passedCount}</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-0.5">
          {['All', 'Images & Media', 'Headings & Hierarchy', 'Color & Contrast', 'Forms & Controls', 'Document & ARIA'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Toast Banner */}
      {fixNotification && (
        <div className="p-2.5 mx-3 mt-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{fixNotification}</span>
        </div>
      )}

      {/* Main Issue List Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4 space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-200">No Violations Found</h4>
            <p className="text-[11px] text-slate-400 max-w-xs">
              {report.issues.length === 0
                ? 'Your HTML code complies with common WCAG 2.1 AA accessibility guidelines!'
                : 'No issues match the selected category or severity filter.'}
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isFixed = fixedIssueIds.has(issue.id);

            return (
              <div
                key={issue.id}
                className={`p-3 rounded-xl border transition-all ${
                  isFixed
                    ? 'bg-emerald-950/20 border-emerald-800/40 opacity-70'
                    : issue.severity === 'error'
                    ? isDark
                      ? 'bg-slate-900/90 border-rose-900/40 hover:border-rose-500/50'
                      : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                    : issue.severity === 'warning'
                    ? isDark
                      ? 'bg-slate-900/90 border-amber-900/40 hover:border-amber-500/50'
                      : 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                    : isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Header Title & Severity Icon */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2 min-w-0">
                    {issue.severity === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate leading-snug">{issue.title}</h4>
                      <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                        <span className="text-indigo-400">Line {issue.line}</span>
                        <span>•</span>
                        <span>{issue.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fix Button */}
                  {issue.fixable && onUpdateHtmlContent && (
                    <button
                      onClick={() => handleFixIssue(issue)}
                      disabled={isFixed}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 shrink-0 transition-all cursor-pointer ${
                        isFixed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      }`}
                    >
                      {isFixed ? <Check className="w-3 h-3 text-emerald-400" /> : <Wand2 className="w-3 h-3" />}
                      <span>{isFixed ? 'Fixed' : issue.fixActionName || 'Auto-Fix'}</span>
                    </button>
                  )}
                </div>

                {/* Message Explanation */}
                <p className={`text-[11px] mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {issue.message}
                </p>

                {/* Code Snippet Box */}
                {issue.snippet && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-emerald-300 border border-slate-800 overflow-x-auto whitespace-pre">
                    <code>{issue.snippet}</code>
                  </div>
                )}

                {/* Suggestion Footer & WCAG Rule */}
                <div className="mt-2 pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-400 gap-1">
                  <span className="text-slate-400 italic">💡 {issue.suggestion}</span>
                  <span className="font-mono text-indigo-300 text-[9px] bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 shrink-0">
                    {issue.wcagRule}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
