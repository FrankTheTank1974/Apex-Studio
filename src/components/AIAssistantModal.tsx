import React, { useState } from 'react';
import { Sparkles, X, Loader2, Code2, Plus } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertGeneratedHtml: (html: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onInsertGeneratedHtml,
}) => {
  const [prompt, setPrompt] = useState('');
  const [generationType, setGenerationType] = useState<'component' | 'section'>('component');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMessage('');
    setGeneratedResult('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: generationType }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedResult(data.result);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during AI generation');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsert = () => {
    if (generatedResult) {
      onInsertGeneratedHtml(generatedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-300">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">AI Component Generator</h3>
              <p className="text-[10px] text-slate-400">Powered by Gemini 2.5 Flash Server API</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Describe what component to build</label>
            <textarea
              rows={3}
              placeholder="e.g., A dark mode pricing card with 3 features, gradient title, and primary button..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setGenerationType('component')}
                className={`px-3 py-1 rounded-lg border font-medium ${
                  generationType === 'component'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                UI Component
              </button>
              <button
                type="button"
                onClick={() => setGenerationType('section')}
                className={`px-3 py-1 rounded-lg border font-medium ${
                  generationType === 'section'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Full Section
              </button>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950 text-white font-bold rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center space-x-1.5"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating HTML...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Code</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="mx-6 mb-4 p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-300">
            {errorMessage}
          </div>
        )}

        {generatedResult && (
          <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center space-x-1">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Generated Tailwind HTML Snippet</span>
              </span>
              <button
                onClick={handleInsert}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insert into Visual Canvas</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-purple-200 overflow-x-auto max-h-48 whitespace-pre-wrap">
              {generatedResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
