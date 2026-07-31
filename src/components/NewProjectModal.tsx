import React, { useState } from 'react';
import { FolderPlus, X, Sparkles, Layout, FileCode, BookOpen, Check } from 'lucide-react';
import { ProjectFile } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectName: string, initialFiles: ProjectFile[]) => void;
}

export const PROJECT_TEMPLATES = [
  {
    id: 'default-starter',
    name: 'ApexStudio Full Starter',
    icon: Sparkles,
    badge: 'Recommended',
    description: 'SaaS landing page with responsive navbar, hero section, integrated Draw.io diagram, and custom JS.',
    files: [
      {
        id: 'index-html',
        name: 'index.html',
        type: 'html' as const,
        path: '/index.html',
        isMain: true,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApexStudio Project</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">

  <!-- NAVIGATION HEADER -->
  <header class="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
          A
        </div>
        <span class="font-bold text-xl text-slate-900 dark:text-white tracking-tight">ApexStudio</span>
      </div>
      <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
        <a href="#features" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
        <a href="#diagrams" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Architecture</a>
        <a href="#deploy" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Deployment</a>
      </nav>
      <div class="flex items-center space-x-4">
        <button id="cta-btn" class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all">Launch Cloud</button>
      </div>
    </div>
  </header>

  <!-- HERO SECTION -->
  <section class="py-16 px-6 max-w-6xl mx-auto text-center">
    <span class="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
      ⚡ WYSIWYG & MULTI-CLOUD DEPLOYMENT
    </span>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
      Visual Web Editor & <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Cloud Archiver</span>
    </h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
      Design graphically with drag-and-drop components, edit raw HTML/CSS/JS code, embed Draw.io diagrams, collaborate live with team members, and export to GitHub, GitLab, Vercel, or local .tar.zst archives.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-4">
      <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
        Start Project
      </button>
      <button class="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all">
        View Specs
      </button>
    </div>
  </section>

  <!-- DRAW.IO ARCHITECTURE EMBED -->
  <section id="diagrams" class="py-12 px-6 max-w-5xl mx-auto">
    <div class="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 text-center shadow-lg drawio-container" data-diagram-id="main-flow">
      <div class="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div class="flex items-center space-x-2">
          <span class="text-amber-400 font-bold">❖</span>
          <span class="font-bold text-sm tracking-wide">Integrated Draw.io Pipeline Diagram</span>
        </div>
        <span class="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">Draw.io Vector</span>
      </div>
      <div class="diagram-viewport p-6 bg-slate-950 rounded-xl flex items-center justify-center min-h-[200px]">
        <svg class="w-full max-w-xl h-auto" viewBox="0 0 550 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="45" width="120" height="70" rx="12" fill="#3B82F6" fill-opacity="0.15" stroke="#3B82F6" stroke-width="2"/>
          <text x="80" y="80" text-anchor="middle" fill="#93C5FD" font-size="13" font-family="sans-serif" font-weight="bold">WYSIWYG Editor</text>
          <text x="80" y="98" text-anchor="middle" fill="#60A5FA" font-size="11" font-family="sans-serif">Visual + Code</text>

          <path d="M140 80 L210 80" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 4"/>

          <rect x="210" y="35" width="140" height="90" rx="14" fill="#8B5CF6" fill-opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
          <text x="280" y="75" text-anchor="middle" fill="#DDD6FE" font-size="14" font-family="sans-serif" font-weight="bold">Real-time Sync</text>
          <text x="280" y="95" text-anchor="middle" fill="#C4B5FD" font-size="11" font-family="sans-serif">WebSocket + Zstd</text>

          <path d="M350 80 L420 80" stroke="#34D399" stroke-width="2"/>

          <rect x="420" y="45" width="110" height="70" rx="12" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2"/>
          <text x="475" y="80" text-anchor="middle" fill="#6EE7B7" font-size="13" font-family="sans-serif" font-weight="bold">Cloud Target</text>
          <text x="475" y="98" text-anchor="middle" fill="#34D399" font-size="11" font-family="sans-serif">GitHub / Vercel</text>
        </svg>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: 'styles-css',
        name: 'styles.css',
        type: 'css' as const,
        path: '/styles.css',
        content: `/* Custom Styles for ApexStudio Project */
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.drawio-container {
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.drawio-container:hover {
  border-color: rgba(99, 102, 241, 0.4);
}
`,
      },
      {
        id: 'script-js',
        name: 'script.js',
        type: 'js' as const,
        path: '/script.js',
        content: `// ApexStudio Client Script
document.addEventListener('DOMContentLoaded', () => {
  console.log('⚡ ApexStudio Interactive Canvas Initialized');
});`,
      },
    ],
  },
  {
    id: 'blank-slate',
    name: 'Blank Slate',
    icon: FileCode,
    badge: 'Clean Canvas',
    description: 'Minimal HTML5 template with Tailwind CSS CDN and clean CSS/JS files ready for scratch building.',
    files: [
      {
        id: 'index-html',
        name: 'index.html',
        type: 'html' as const,
        path: '/index.html',
        isMain: true,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Blank Project</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-6 text-center">

  <div id="welcome-card" class="relative max-w-md p-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl">
    <button id="close-welcome-btn" onclick="document.getElementById('welcome-card').remove()" class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-bold cursor-pointer" title="Close Welcome Window">
      ✕
    </button>
    <div class="w-12 h-12 mx-auto mb-4 bg-indigo-600/20 border border-indigo-500/40 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xl">
      ✨
    </div>
    <h1 class="text-2xl font-bold mb-2">Blank Web Project</h1>
    <p class="text-slate-400 text-sm mb-6">Drag components from the library panel or start typing custom HTML to build your design.</p>
    <button id="get-started-btn" onclick="document.getElementById('welcome-card').remove()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer">
      Get Started
    </button>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: 'styles-css',
        name: 'styles.css',
        type: 'css' as const,
        path: '/styles.css',
        content: `/* Blank Custom Styles */
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}`,
      },
      {
        id: 'script-js',
        name: 'script.js',
        type: 'js' as const,
        path: '/script.js',
        content: `// Client-side interactions
document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('welcome-card');
  const closeBtn = document.getElementById('close-welcome-btn');
  const getStartedBtn = document.getElementById('get-started-btn');

  const removeCard = () => {
    if (card) card.remove();
  };

  if (closeBtn) closeBtn.addEventListener('click', removeCard);
  if (getStartedBtn) getStartedBtn.addEventListener('click', removeCard);
});`,
      },
    ],
  },
  {
    id: 'portfolio-showcase',
    name: 'Portfolio & Showcase',
    icon: Layout,
    badge: 'Popular',
    description: 'Personal portfolio layout featuring a intro banner, featured work cards, skills grid, and contact form.',
    files: [
      {
        id: 'index-html',
        name: 'index.html',
        type: 'html' as const,
        path: '/index.html',
        isMain: true,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developer Portfolio</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">

  <!-- Header -->
  <header class="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
        D
      </div>
      <span class="font-bold text-lg">Alex Dev</span>
    </div>
    <nav class="flex items-center space-x-6 text-sm text-slate-400">
      <a href="#about" class="hover:text-white transition-colors">About</a>
      <a href="#projects" class="hover:text-white transition-colors">Projects</a>
      <a href="#contact" class="hover:text-white transition-colors">Contact</a>
    </nav>
  </header>

  <!-- Hero Banner -->
  <section id="about" class="max-w-4xl mx-auto py-20 px-6 text-center">
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
      Full-Stack Engineer & <span class="text-purple-400">UI Designer</span>
    </h1>
    <p class="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
      Building modern web applications, high-performance web systems, and interactive tools.
    </p>
    <div class="flex items-center justify-center space-x-4">
      <a href="#projects" class="px-6 py-3 bg-purple-600 hover:bg-purple-500 font-bold text-white rounded-xl shadow-lg shadow-purple-600/30 transition-all">
        View My Work
      </a>
      <a href="#contact" class="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 font-semibold text-slate-300 rounded-xl transition-all">
        Get in Touch
      </a>
    </div>
  </section>

  <!-- Projects Grid -->
  <section id="projects" class="max-w-6xl mx-auto py-12 px-6">
    <h2 class="text-2xl font-bold mb-8 text-slate-200">Featured Projects</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 hover:border-purple-500/50 transition-all">
        <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Web App</span>
        <h3 class="text-xl font-bold mt-1 mb-2">Cloud Canvas IDE</h3>
        <p class="text-slate-400 text-sm mb-4">Real-time collaborative visual code studio with multi-cloud deployments.</p>
        <span class="text-xs px-2.5 py-1 bg-purple-950/80 text-purple-300 rounded-lg border border-purple-800">TypeScript / React</span>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 hover:border-purple-500/50 transition-all">
        <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">SaaS</span>
        <h3 class="text-xl font-bold mt-1 mb-2">Workflow Automation</h3>
        <p class="text-slate-400 text-sm mb-4">Automated API integration builder with WebSocket event triggers.</p>
        <span class="text-xs px-2.5 py-1 bg-purple-950/80 text-purple-300 rounded-lg border border-purple-800">Node.js / Express</span>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: 'styles-css',
        name: 'styles.css',
        type: 'css' as const,
        path: '/styles.css',
        content: `/* Portfolio Styles */
html {
  scroll-behavior: smooth;
}`,
      },
      {
        id: 'script-js',
        name: 'script.js',
        type: 'js' as const,
        path: '/script.js',
        content: `console.log('Portfolio initialized');`,
      },
    ],
  },
  {
    id: 'docs-site',
    name: 'Documentation Site',
    icon: BookOpen,
    badge: 'Technical',
    description: 'Technical docs page with sticky sidebar navigation, search bar, code blocks, and article layout.',
    files: [
      {
        id: 'index-html',
        name: 'index.html',
        type: 'html' as const,
        path: '/index.html',
        isMain: true,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-200 min-h-screen flex flex-col">

  <!-- Header -->
  <header class="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
    <div class="flex items-center space-x-3">
      <span class="font-bold text-indigo-400">❖ Docs</span>
      <span class="text-slate-600">|</span>
      <span class="text-xs text-slate-400 font-mono">v2.5.0</span>
    </div>
    <div class="w-64 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-400 flex items-center justify-between">
      <span>Search docs...</span>
      <kbd class="px-1.5 py-0.5 bg-slate-900 rounded text-[10px] text-slate-500">⌘K</kbd>
    </div>
  </header>

  <!-- Docs Layout -->
  <div class="flex-1 flex max-w-7xl mx-auto w-full">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-slate-800 p-6 space-y-6 hidden md:block">
      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Getting Started</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="#" class="text-indigo-400 font-medium">Overview</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white">Quickstart Guide</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white">Authentication</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Core Concepts</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="#" class="text-slate-400 hover:text-white">REST API Reference</a></li>
          <li><a href="#" class="text-slate-400 hover:text-white">WebSockets Events</a></li>
          <li><a href="#media-formats" class="text-purple-400 font-medium hover:text-purple-300">Supported Media Formats</a></li>
        </ul>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 max-w-3xl space-y-8">
      <div>
        <span class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Overview</span>
        <h1 class="text-3xl font-extrabold text-white mt-1 mb-4">ApexStudio API Overview</h1>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">
          The ApexStudio API allows developers to programmatically create components, stream real-time code changes, and trigger cloud deployment workflows.
        </p>

        <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 font-mono text-xs text-slate-300">
          <div class="text-slate-500 mb-2">// Sample API Authentication Request</div>
          <div class="text-purple-400">curl <span class="text-indigo-300">-X POST https://api.apexstudio.io/v1/projects</span> \\</div>
          <div class="text-indigo-300">  -H <span class="text-emerald-400">"Authorization: Bearer YOUR_API_KEY"</span></div>
        </div>
      </div>

      <!-- Supported Media & Video Formats Section -->
      <section id="media-formats" class="pt-6 border-t border-slate-800">
        <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">Asset Specifications</span>
        <h2 class="text-2xl font-bold text-white mt-1 mb-4">Supported Media & Video Formats</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 class="font-bold text-purple-400 text-sm">🎥 Video Formats & Codecs</h3>
            <ul class="space-y-1 list-disc list-inside text-slate-300">
              <li><strong>MP4 (.mp4)</strong>: H.264 / AAC (Universal browser compatibility)</li>
              <li><strong>WebM (.webm)</strong>: VP8 / VP9 / AV1 (Optimized web video)</li>
              <li><strong>Ogg (.ogg, .ogv)</strong>: Theora video + Vorbis audio</li>
              <li><strong>QuickTime (.mov, .m4v)</strong>: MPEG-4 container video</li>
              <li><strong>Direct Video URLs</strong>: HTTP/HTTPS & Base64 Data URLs</li>
            </ul>
          </div>

          <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 class="font-bold text-indigo-400 text-sm">🖼️ Image Formats</h3>
            <ul class="space-y-1 list-disc list-inside text-slate-300">
              <li><strong>JPEG XL (.jxl)</strong>: Next-gen high efficiency & lossless image format</li>
              <li><strong>JPEG 2000 (.jp2, .j2k)</strong>: Native browser support in Safari / WebKit</li>
              <li><strong>PNG (.png)</strong>: Lossless quality with full transparency</li>
              <li><strong>JPEG (.jpg, .jpeg)</strong>: Standard web photography</li>
              <li><strong>WebP (.webp)</strong>: Next-gen compressed web images</li>
              <li><strong>SVG (.svg)</strong>: Scalable vector graphics</li>
              <li><strong>GIF (.gif)</strong>: Animated motion graphics</li>
              <li><strong>AVIF, BMP, ICO</strong>: AV1 image files & icon graphics</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: 'styles-css',
        name: 'styles.css',
        type: 'css' as const,
        path: '/styles.css',
        content: `/* Documentation CSS */
body {
  font-family: system-ui, -apple-system, sans-serif;
}`,
      },
      {
        id: 'script-js',
        name: 'script.js',
        type: 'js' as const,
        path: '/script.js',
        content: `console.log('Docs viewer ready');`,
      },
    ],
  },
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [projectName, setProjectName] = useState('New Web Project');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('default-starter');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const template = PROJECT_TEMPLATES.find((t) => t.id === selectedTemplateId) || PROJECT_TEMPLATES[0];
    
    // Deep clone template files
    const newFiles: ProjectFile[] = template.files.map((f) => ({
      ...f,
      id: f.id,
    }));

    onCreateProject(projectName.trim() || 'New Web Project', newFiles);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-xs text-slate-300">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FolderPlus className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Create New Project</h3>
              <p className="text-[10px] text-slate-400">Select a starter template to initialize your workspace</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., SaaS Launchpad, Portfolio V2..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {/* Template Grid */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Choose Starter Template</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECT_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                          <tmpl.icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-100 text-xs">{tmpl.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-md">
                        {tmpl.badge}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {tmpl.files.length} files
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Initialize Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
