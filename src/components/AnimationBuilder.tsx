import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Sparkles, 
  Check, 
  Copy, 
  Trash2, 
  Zap, 
  Layers, 
  Activity, 
  Wrench,
  Clock,
  RotateCw,
  Sliders,
  Maximize2
} from 'lucide-react';
import { SelectedElementInfo } from '../types';

export interface AnimationPreset {
  id: string;
  name: string;
  category: 'entrance' | 'exit' | 'attention';
  description: string;
  keyframesName: string;
  keyframesCss: string;
  defaultDuration: string;
  defaultEasing: string;
  defaultFillMode: string;
}

export const ANIMATION_PRESETS: AnimationPreset[] = [
  // ENTRANCE
  {
    id: 'fade-in',
    name: 'Fade In',
    category: 'entrance',
    description: 'Smooth opacity fade from hidden to visible',
    keyframesName: 'anim-fade-in',
    keyframesCss: `@keyframes anim-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}`,
    defaultDuration: '0.5s',
    defaultEasing: 'ease-out',
    defaultFillMode: 'forwards'
  },
  {
    id: 'fade-in-up',
    name: 'Fade In Up',
    category: 'entrance',
    description: 'Fades in while sliding up gently',
    keyframesName: 'anim-fade-in-up',
    keyframesCss: `@keyframes anim-fade-in-up {
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
}`,
    defaultDuration: '0.6s',
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    defaultFillMode: 'forwards'
  },
  {
    id: 'fade-in-down',
    name: 'Fade In Down',
    category: 'entrance',
    description: 'Fades in while dropping down smoothly',
    keyframesName: 'anim-fade-in-down',
    keyframesCss: `@keyframes anim-fade-in-down {
  0% { opacity: 0; transform: translateY(-24px); }
  100% { opacity: 1; transform: translateY(0); }
}`,
    defaultDuration: '0.6s',
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    defaultFillMode: 'forwards'
  },
  {
    id: 'fade-in-left',
    name: 'Fade In Left',
    category: 'entrance',
    description: 'Fades in while sliding from the left',
    keyframesName: 'anim-fade-in-left',
    keyframesCss: `@keyframes anim-fade-in-left {
  0% { opacity: 0; transform: translateX(-24px); }
  100% { opacity: 1; transform: translateX(0); }
}`,
    defaultDuration: '0.6s',
    defaultEasing: 'ease-out',
    defaultFillMode: 'forwards'
  },
  {
    id: 'fade-in-right',
    name: 'Fade In Right',
    category: 'entrance',
    description: 'Fades in while sliding from the right',
    keyframesName: 'anim-fade-in-right',
    keyframesCss: `@keyframes anim-fade-in-right {
  0% { opacity: 0; transform: translateX(24px); }
  100% { opacity: 1; transform: translateX(0); }
}`,
    defaultDuration: '0.6s',
    defaultEasing: 'ease-out',
    defaultFillMode: 'forwards'
  },
  {
    id: 'zoom-in',
    name: 'Zoom / Scale In',
    category: 'entrance',
    description: 'Scales up smoothly from 80% to 100%',
    keyframesName: 'anim-zoom-in',
    keyframesCss: `@keyframes anim-zoom-in {
  0% { opacity: 0; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1); }
}`,
    defaultDuration: '0.5s',
    defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    defaultFillMode: 'forwards'
  },
  {
    id: 'bounce-in',
    name: 'Bounce In',
    category: 'entrance',
    description: 'Energetic bounce entrance effect',
    keyframesName: 'anim-bounce-in',
    keyframesCss: `@keyframes anim-bounce-in {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.08); }
  70% { transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
}`,
    defaultDuration: '0.7s',
    defaultEasing: 'ease-in-out',
    defaultFillMode: 'forwards'
  },
  {
    id: 'pop-in',
    name: 'Pop In (Spring)',
    category: 'entrance',
    description: 'Snappy spring pop entrance',
    keyframesName: 'anim-pop-in',
    keyframesCss: `@keyframes anim-pop-in {
  0% { opacity: 0; transform: scale(0.5) translateY(12px); }
  70% { transform: scale(1.05) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}`,
    defaultDuration: '0.5s',
    defaultEasing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    defaultFillMode: 'forwards'
  },
  {
    id: 'slide-in-bottom',
    name: 'Slide In Bottom',
    category: 'entrance',
    description: 'Full slide up from bottom edge',
    keyframesName: 'anim-slide-in-bottom',
    keyframesCss: `@keyframes anim-slide-in-bottom {
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
}`,
    defaultDuration: '0.5s',
    defaultEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    defaultFillMode: 'forwards'
  },
  {
    id: 'flip-in',
    name: 'Flip In 3D',
    category: 'entrance',
    description: '3D perspective flip entrance along X-axis',
    keyframesName: 'anim-flip-in',
    keyframesCss: `@keyframes anim-flip-in {
  0% { opacity: 0; transform: perspective(400px) rotateX(90deg); }
  100% { opacity: 1; transform: perspective(400px) rotateX(0deg); }
}`,
    defaultDuration: '0.6s',
    defaultEasing: 'ease-out',
    defaultFillMode: 'forwards'
  },

  // EXIT
  {
    id: 'fade-out',
    name: 'Fade Out',
    category: 'exit',
    description: 'Smooth opacity fade to hidden',
    keyframesName: 'anim-fade-out',
    keyframesCss: `@keyframes anim-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}`,
    defaultDuration: '0.4s',
    defaultEasing: 'ease-in',
    defaultFillMode: 'forwards'
  },
  {
    id: 'fade-out-down',
    name: 'Fade Out Down',
    category: 'exit',
    description: 'Fades out while dropping down',
    keyframesName: 'anim-fade-out-down',
    keyframesCss: `@keyframes anim-fade-out-down {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(24px); }
}`,
    defaultDuration: '0.5s',
    defaultEasing: 'ease-in',
    defaultFillMode: 'forwards'
  },
  {
    id: 'zoom-out',
    name: 'Zoom / Scale Out',
    category: 'exit',
    description: 'Scales down and disappears',
    keyframesName: 'anim-zoom-out',
    keyframesCss: `@keyframes anim-zoom-out {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.85); }
}`,
    defaultDuration: '0.4s',
    defaultEasing: 'ease-in',
    defaultFillMode: 'forwards'
  },
  {
    id: 'slide-out-right',
    name: 'Slide Out Right',
    category: 'exit',
    description: 'Slides off-screen to the right',
    keyframesName: 'anim-slide-out-right',
    keyframesCss: `@keyframes anim-slide-out-right {
  0% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}`,
    defaultDuration: '0.4s',
    defaultEasing: 'ease-in',
    defaultFillMode: 'forwards'
  },

  // ATTENTION SEEKERS & LOOPS
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'attention',
    description: 'Rhythmic scale pulse effect',
    keyframesName: 'anim-pulse',
    keyframesCss: `@keyframes anim-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.06); }
}`,
    defaultDuration: '1.5s',
    defaultEasing: 'ease-in-out',
    defaultFillMode: 'none'
  },
  {
    id: 'bounce',
    name: 'Bounce Loop',
    category: 'attention',
    description: 'Playful vertical bouncing loop',
    keyframesName: 'anim-bounce',
    keyframesCss: `@keyframes anim-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}`,
    defaultDuration: '1s',
    defaultEasing: 'ease-in-out',
    defaultFillMode: 'none'
  },
  {
    id: 'shake',
    name: 'Shake / Jiggle',
    category: 'attention',
    description: 'Horizontal shake effect for form errors or alerts',
    keyframesName: 'anim-shake',
    keyframesCss: `@keyframes anim-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}`,
    defaultDuration: '0.6s',
    defaultEasing: 'ease-in-out',
    defaultFillMode: 'none'
  },
  {
    id: 'spin',
    name: 'Spin / Rotate',
    category: 'attention',
    description: 'Continuous 360-degree rotation',
    keyframesName: 'anim-spin',
    keyframesCss: `@keyframes anim-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
    defaultDuration: '1.2s',
    defaultEasing: 'linear',
    defaultFillMode: 'none'
  },
  {
    id: 'glow-pulse',
    name: 'Glow Pulse',
    category: 'attention',
    description: 'Pulsing indigo glow shadow effect',
    keyframesName: 'anim-glow-pulse',
    keyframesCss: `@keyframes anim-glow-pulse {
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.85); }
}`,
    defaultDuration: '2s',
    defaultEasing: 'ease-in-out',
    defaultFillMode: 'none'
  },
  {
    id: 'rubberband',
    name: 'Rubberband Elastic',
    category: 'attention',
    description: 'Elastic stretch and squeeze effect',
    keyframesName: 'anim-rubberband',
    keyframesCss: `@keyframes anim-rubberband {
  0% { transform: scale(1); }
  30% { transform: scaleX(1.25) scaleY(0.75); }
  40% { transform: scaleX(0.75) scaleY(1.25); }
  50% { transform: scaleX(1.15) scaleY(0.85); }
  100% { transform: scale(1); }
}`,
    defaultDuration: '0.8s',
    defaultEasing: 'ease-in-out',
    defaultFillMode: 'none'
  }
];

interface AnimationBuilderProps {
  selectedElement: SelectedElementInfo | null;
  onUpdateElement: (updatedInfo: Partial<SelectedElementInfo>) => void;
  cssContent?: string;
  onUpdateCssContent?: (newCss: string) => void;
  isDark?: boolean;
}

export const AnimationBuilder: React.FC<AnimationBuilderProps> = ({
  selectedElement,
  onUpdateElement,
  cssContent = '',
  onUpdateCssContent,
  isDark = true
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('fade-in-up');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'entrance' | 'exit' | 'attention'>('all');
  
  // Customization controls
  const [duration, setDuration] = useState<number>(0.6); // seconds
  const [delay, setDelay] = useState<number>(0);         // seconds
  const [easing, setEasing] = useState<string>('cubic-bezier(0.16, 1, 0.3, 1)');
  const [iteration, setIteration] = useState<string>('1');
  const [fillMode, setFillMode] = useState<string>('forwards');

  // Preview state
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [copiedCss, setCopiedCss] = useState<boolean>(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  // Current selected preset
  const currentPreset = useMemo(() => {
    return ANIMATION_PRESETS.find((p) => p.id === selectedPresetId) || ANIMATION_PRESETS[1];
  }, [selectedPresetId]);

  // When preset changes, update default parameters
  const handleSelectPreset = (preset: AnimationPreset) => {
    setSelectedPresetId(preset.id);
    const durNum = parseFloat(preset.defaultDuration) || 0.6;
    setDuration(durNum);
    setEasing(preset.defaultEasing);
    setFillMode(preset.defaultFillMode);
    if (preset.category === 'attention') {
      setIteration('infinite');
    } else {
      setIteration('1');
    }
    setPreviewKey((prev) => prev + 1);
  };

  // Filtered presets
  const filteredPresets = useMemo(() => {
    if (categoryFilter === 'all') return ANIMATION_PRESETS;
    return ANIMATION_PRESETS.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  // Detect currently active animation class on selected element
  const currentActiveAnimationClass = useMemo(() => {
    if (!selectedElement || !selectedElement.classList) return null;
    return selectedElement.classList.find((c) => c.startsWith('animate-') || c.startsWith('anim-'));
  }, [selectedElement]);

  // Derived className for element
  const animationClassName = `animate-${currentPreset.id}`;

  // Generated CSS rule string
  const generatedCss = useMemo(() => {
    const keyframes = currentPreset.keyframesCss;
    const animationDeclaration = `${currentPreset.keyframesName} ${duration}s ${easing} ${delay}s ${iteration} ${fillMode}`;
    const classRule = `.${animationClassName} {\n  animation: ${animationDeclaration};\n}`;

    return `${keyframes}\n\n${classRule}`;
  }, [currentPreset, duration, easing, delay, iteration, fillMode, animationClassName]);

  // Replay animation preview in the panel
  const handleTriggerPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  // Apply animation to selected element & inject CSS into stylesheet
  const handleApplyAnimation = () => {
    if (!selectedElement) return;

    // 1. Clean existing animation classes from selected element's classList
    const cleanClassList = (selectedElement.classList || []).filter(
      (c) => !c.startsWith('animate-') && !c.startsWith('anim-')
    );

    const updatedClassList = [...cleanClassList, animationClassName];
    onUpdateElement({ classList: updatedClassList });

    // 2. Inject generated CSS rule into styles.css if missing or outdated
    if (onUpdateCssContent) {
      let updatedCss = cssContent;

      // Ensure keyframes and class definition are present in CSS
      if (!updatedCss.includes(currentPreset.keyframesName)) {
        updatedCss = `${updatedCss.trim()}\n\n/* Generated Animation: ${currentPreset.name} */\n${generatedCss}`;
      } else {
        // Replace existing class declaration if custom parameters changed
        const classRegex = new RegExp(`\\.${animationClassName}\\s*\\{[^}]*\\}`, 'g');
        const newClassRule = `.${animationClassName} {\n  animation: ${currentPreset.keyframesName} ${duration}s ${easing} ${delay}s ${iteration} ${fillMode};\n}`;

        if (classRegex.test(updatedCss)) {
          updatedCss = updatedCss.replace(classRegex, newClassRule);
        } else {
          updatedCss = `${updatedCss.trim()}\n\n${newClassRule}`;
        }
      }

      onUpdateCssContent(updatedCss);
    }

    setAppliedNotification(`Applied .${animationClassName} to selected element!`);
    setTimeout(() => setAppliedNotification(null), 2500);
  };

  // Remove active animation from selected element
  const handleRemoveAnimation = () => {
    if (!selectedElement) return;
    const cleanClassList = (selectedElement.classList || []).filter(
      (c) => !c.startsWith('animate-') && !c.startsWith('anim-')
    );
    onUpdateElement({ classList: cleanClassList });
    setAppliedNotification('Removed animation from element');
    setTimeout(() => setAppliedNotification(null), 2000);
  };

  const handleCopyCss = () => {
    try {
      navigator.clipboard.writeText(generatedCss);
      setCopiedCss(true);
      setTimeout(() => setCopiedCss(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* Dynamic Keyframes Animation Injection Tag for live panel preview */}
      <style>{generatedCss}</style>

      {/* Target Element Context Header */}
      <div className={`p-3 rounded-xl border flex items-center justify-between ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
          <div>
            <div className="font-bold text-xs text-indigo-400 flex items-center space-x-1.5">
              <span>CSS Animation Builder</span>
            </div>
            {selectedElement ? (
              <span className="text-[10px] text-slate-400 font-mono">
                Target: <code className="text-indigo-300">&lt;{selectedElement.tagName.toLowerCase()}{selectedElement.id ? `#${selectedElement.id}` : ''}&gt;</code>
              </span>
            ) : (
              <span className="text-[10px] text-amber-400">
                Select an element on canvas to apply
              </span>
            )}
          </div>
        </div>

        {currentActiveAnimationClass && (
          <button
            type="button"
            onClick={handleRemoveAnimation}
            className="flex items-center space-x-1 px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded text-[10px] font-semibold transition-colors cursor-pointer"
            title="Remove active animation class from element"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove ({currentActiveAnimationClass})</span>
          </button>
        )}
      </div>

      {appliedNotification && (
        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center space-x-1.5 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 space-x-1">
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${
            categoryFilter === 'all' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({ANIMATION_PRESETS.length})
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('entrance')}
          className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${
            categoryFilter === 'entrance' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Entrance
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('exit')}
          className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${
            categoryFilter === 'exit' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Exit
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('attention')}
          className={`flex-1 py-1 text-[10px] font-bold rounded transition-colors ${
            categoryFilter === 'attention' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Loops
        </button>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
        {filteredPresets.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-950/70 border-indigo-500 text-white ring-1 ring-indigo-500'
                  : isDark
                    ? 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-[11px] truncate">{preset.name}</span>
                <span className={`text-[8px] uppercase px-1 py-0.2 rounded font-mono font-bold ${
                  preset.category === 'entrance'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : preset.category === 'exit'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {preset.category}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Live Preview Box */}
      <div className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 relative overflow-hidden min-h-[90px] ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
          Live Interactive Preview
        </div>

        <button
          type="button"
          onClick={handleTriggerPreview}
          className="absolute top-1.5 right-1.5 p-1 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] flex items-center space-x-1 cursor-pointer"
          title="Replay animation preview"
        >
          <RotateCw className="w-3 h-3 text-indigo-400" />
          <span>Replay</span>
        </button>

        {/* Animated Box */}
        <div
          key={previewKey}
          className={`px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-xs shadow-lg flex items-center space-x-2 border border-indigo-400/30 cursor-pointer ${animationClassName}`}
          onClick={handleTriggerPreview}
          style={{
            animationDuration: `${duration}s`,
            animationTimingFunction: easing,
            animationDelay: `${delay}s`,
            animationIterationCount: iteration,
            animationFillMode: fillMode
          }}
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>{currentPreset.name}</span>
        </div>

        <span className="text-[9px] text-slate-500 font-mono">
          Click box or Replay button to test
        </span>
      </div>

      {/* Transition Customization Parameters */}
      <div className={`p-3 rounded-xl border space-y-3 ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-1.5 font-bold text-xs text-slate-200 border-b border-slate-800/80 pb-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Transition & Timing Customizer</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Duration Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>Duration</span>
              </span>
              <span className="font-mono text-indigo-300 font-bold">{duration}s</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Delay Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
              <span className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-indigo-400" />
                <span>Delay</span>
              </span>
              <span className="font-mono text-indigo-300 font-bold">{delay}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.1"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Easing / Timing Function */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Easing Curve
            </label>
            <select
              value={easing}
              onChange={(e) => setEasing(e.target.value)}
              className={`w-full px-2 py-1 text-[11px] font-mono border rounded-lg focus:outline-none focus:border-indigo-500 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="ease">ease</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-in-out">ease-in-out</option>
              <option value="linear">linear</option>
              <option value="cubic-bezier(0.16, 1, 0.3, 1)">Smooth Spring</option>
              <option value="cubic-bezier(0.34, 1.56, 0.64, 1)">Bounce Pop</option>
              <option value="cubic-bezier(0.68, -0.55, 0.26, 1.55)">Elastic Back</option>
            </select>
          </div>

          {/* Iteration Count */}
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 block">
              Loop Count
            </label>
            <select
              value={iteration}
              onChange={(e) => setIteration(e.target.value)}
              className={`w-full px-2 py-1 text-[11px] font-mono border rounded-lg focus:outline-none focus:border-indigo-500 ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="1">1 (Once)</option>
              <option value="2">2 times</option>
              <option value="3">3 times</option>
              <option value="infinite">infinite (Loop)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated CSS Preview & Actions */}
      <div className={`p-3 rounded-xl border space-y-2 ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="font-bold text-slate-300">Generated CSS Output</span>
          <button
            type="button"
            onClick={handleCopyCss}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-sans cursor-pointer"
          >
            {copiedCss ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy CSS</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-2.5 rounded-lg bg-slate-900 text-indigo-200 font-mono text-[10px] leading-relaxed overflow-x-auto border border-slate-800 max-h-32 select-all">
          {generatedCss}
        </pre>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handleApplyAnimation}
          disabled={!selectedElement}
          className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all ${
            selectedElement
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>
            {selectedElement ? `Apply .${animationClassName} to Element` : 'Select an Element First'}
          </span>
        </button>
      </div>
    </div>
  );
};
