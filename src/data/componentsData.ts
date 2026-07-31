import { ComponentTemplate } from '../types';

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // LAYOUT
  {
    id: 'hero-modern',
    name: 'Modern SaaS Hero',
    category: 'layout',
    icon: 'Sparkles',
    description: 'Hero header with title, subtext, CTA buttons and preview card',
    html: `<section class="py-16 px-6 max-w-6xl mx-auto text-center">
  <span class="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
    ⚡ NEXT GENERATION BUILDER
  </span>
  <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
    Build & Deploy Web Apps <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Faster Than Ever</span>
  </h1>
  <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
    Visual drag-and-drop HTML editor, real-time collaboration, instant diagramming, and automated multi-cloud deployments to Vercel, Netlify, and GitHub.
  </p>
  <div class="flex flex-wrap items-center justify-center gap-4">
    <a href="#get-started" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5">
      Start Building Free
    </a>
    <a href="#demo" class="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-all">
      Watch Interactive Demo
    </a>
  </div>
</section>`
  },
  {
    id: 'navbar-sleek',
    name: 'Responsive Navigation Bar',
    category: 'layout',
    icon: 'Navigation',
    description: 'Header with brand logo, nav links, and CTA button',
    html: `<header class="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
        A
      </div>
      <span class="font-bold text-xl text-slate-900 dark:text-white tracking-tight">ApexStudio</span>
    </div>
    <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
      <a href="#features" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
      <a href="#components" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Components</a>
      <a href="#pricing" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</a>
      <a href="#docs" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Documentation</a>
    </nav>
    <div class="flex items-center space-x-4">
      <button class="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">Sign In</button>
      <button class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-500/20 transition-all">Get Started</button>
    </div>
  </div>
</header>`
  },
  {
    id: 'feature-3col',
    name: '3-Column Feature Cards',
    category: 'layout',
    icon: 'LayoutGrid',
    description: 'Grid layout highlighting key platform capabilities',
    html: `<section class="py-12 px-6 max-w-6xl mx-auto">
  <div class="text-center mb-12">
    <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Everything You Need To Deliver</h2>
    <p class="text-slate-500 dark:text-slate-400 mt-2">Engineered for modern developers and visual design teams.</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/80 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 font-bold text-xl">⚡</div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">WYSIWYG Editing</h3>
      <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Direct visual canvas manipulation with real-time HTML, CSS, and JS code synchronization.</p>
    </div>
    <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-purple-100 dark:bg-purple-950/80 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 font-bold text-xl">🌐</div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Multi-Cloud Deploy</h3>
      <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Deploy directly to Vercel, Netlify, GitHub, GitLab, Bitbucket, or Codeberg in one click.</p>
    </div>
    <div class="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 font-bold text-xl">👥</div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Live Collaboration</h3>
      <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Real-time team presence, multi-user visual element locking, and instant state sync.</p>
    </div>
  </div>
</section>`
  },
  {
    id: 'footer-clean',
    name: 'Clean Modern Footer',
    category: 'layout',
    icon: 'PanelBottom',
    description: 'Footer with column links and copyright text',
    html: `<footer class="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
    <div>
      <span class="text-white font-bold text-lg">ApexStudio</span>
      <p class="mt-2 text-sm text-slate-400">The premier visual Web IDE & deployment platform.</p>
    </div>
    <div>
      <h4 class="text-white font-semibold text-sm mb-3">Product</h4>
      <ul class="space-y-2 text-sm">
        <li><a href="#" class="hover:text-white transition-colors">Visual Editor</a></li>
        <li><a href="#" class="hover:text-white transition-colors">Draw.io Diagrams</a></li>
        <li><a href="#" class="hover:text-white transition-colors">Tar.zst Archiver</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-semibold text-sm mb-3">Integrations</h4>
      <ul class="space-y-2 text-sm">
        <li><a href="#" class="hover:text-white transition-colors">GitHub & GitLab</a></li>
        <li><a href="#" class="hover:text-white transition-colors">Vercel & Netlify</a></li>
        <li><a href="#" class="hover:text-white transition-colors">Codeberg & Bitbucket</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-semibold text-sm mb-3">Company</h4>
      <ul class="space-y-2 text-sm">
        <li><a href="#" class="hover:text-white transition-colors">About Us</a></li>
        <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
        <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="max-w-6xl mx-auto pt-8 border-t border-slate-800 text-xs text-center text-slate-500">
    © 2026 ApexStudio. All rights reserved. Built with precision.
  </div>
</footer>`
  },

  // UI ELEMENTS & BUTTONS
  {
    id: 'btn-primary',
    name: 'Primary Action Button',
    category: 'ui',
    icon: 'SquareMousePointer',
    description: 'Indigo rounded button with hover state',
    html: `<button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all active:scale-95">
  Action Button
</button>`
  },
  {
    id: 'card-interactive',
    name: 'Media Card',
    category: 'ui',
    icon: 'CreditCard',
    description: 'Image top card with title, description, and action link',
    html: `<div class="max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
  <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" alt="Code preview" class="w-full h-48 object-cover" />
  <div class="p-6">
    <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Tutorial</span>
    <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">Building Clean UI Architectures</h3>
    <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">Learn how to compose modular layout systems using utility classes and reusable component patterns.</p>
    <a href="#" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center space-x-1">
      <span>Read Article</span>
      <span>→</span>
    </a>
  </div>
</div>`
  },
  {
    id: 'pricing-table',
    name: 'Pricing Tier Card',
    category: 'ui',
    icon: 'Tag',
    description: 'Featured pricing card with feature checklist',
    html: `<div class="max-w-sm p-8 bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 shadow-xl relative">
  <span class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
    Most Popular
  </span>
  <h3 class="text-xl font-bold text-slate-900 dark:text-white">Pro Studio</h3>
  <p class="text-slate-500 text-sm mt-1">Ideal for team collaboration and multi-cloud deployment</p>
  <div class="my-6">
    <span class="text-4xl font-extrabold text-slate-900 dark:text-white">$29</span>
    <span class="text-slate-500 text-sm font-medium">/ month</span>
  </div>
  <ul class="space-y-3 mb-8 text-sm text-slate-600 dark:text-slate-300">
    <li class="flex items-center space-x-2"><span class="text-emerald-500">✓</span><span>Unlimited HTML & CSS Projects</span></li>
    <li class="flex items-center space-x-2"><span class="text-emerald-500">✓</span><span>Draw.io Diagram Integration</span></li>
    <li class="flex items-center space-x-2"><span class="text-emerald-500">✓</span><span>Real-time Team Collaboration</span></li>
    <li class="flex items-center space-x-2"><span class="text-emerald-500">✓</span><span>GitHub, Vercel & Netlify Push</span></li>
    <li class="flex items-center space-x-2"><span class="text-emerald-500">✓</span><span>.tar.zst Binary Archival</span></li>
  </ul>
  <button class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all">
    Get Started Now
  </button>
</div>`
  },

  // FORMS
  {
    id: 'form-contact',
    name: 'Contact Us Form',
    category: 'forms',
    icon: 'Mail',
    description: 'Full contact form with inputs and message area',
    html: `<form class="max-w-lg p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4" onsubmit="event.preventDefault(); alert('Form submitted!');">
  <h3 class="text-xl font-bold text-slate-900 dark:text-white">Get in Touch</h3>
  <div>
    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
    <input type="text" placeholder="John Doe" class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
  </div>
  <div>
    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
    <input type="email" placeholder="john@example.com" class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
  </div>
  <div>
    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
    <textarea rows="4" placeholder="How can we help you?" class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required></textarea>
  </div>
  <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all">
    Send Message
  </button>
</form>`
  },

  // DRAW.IO DIAGRAM EMBED
  {
    id: 'drawio-embed-container',
    name: 'Draw.io Diagram Block',
    category: 'drawio',
    icon: 'Workflow',
    description: 'Interactive flowchart/architecture container for Draw.io diagrams',
    html: `<div class="my-8 p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-lg drawio-container relative group font-sans" data-diagram-id="arch-1">
  <div class="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
    <div class="flex items-center space-x-2">
      <span class="text-amber-500 font-bold">❖</span>
      <span class="diagram-title font-bold text-sm tracking-wide">System Architecture Diagram</span>
    </div>
    <div class="flex items-center space-x-2">
      <span class="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-full border border-amber-500/30 font-medium">Draw.io Vector</span>
      <button type="button" data-action="open-drawio" class="open-drawio-btn text-xs px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium cursor-pointer">Edit Diagram</button>
    </div>
  </div>
  <div data-action="open-drawio" class="diagram-viewport cursor-pointer p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center min-h-[220px]">
    <svg class="w-full max-w-lg h-auto" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="70" width="110" height="60" rx="10" fill="#3B82F6" fill-opacity="0.2" stroke="#60A5FA" stroke-width="2"/>
      <text x="75" y="105" text-anchor="middle" fill="#2563EB" font-size="14" font-family="sans-serif" font-weight="bold">Client App</text>
      
      <path d="M130 100 L200 100" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4 4"/>
      
      <rect x="200" y="50" width="130" height="100" rx="12" fill="#8B5CF6" fill-opacity="0.2" stroke="#A78BFA" stroke-width="2"/>
      <text x="265" y="95" text-anchor="middle" fill="#7C3AED" font-size="14" font-family="sans-serif" font-weight="bold">Cloud IDE Server</text>
      <text x="265" y="115" text-anchor="middle" fill="#8B5CF6" font-size="11" font-family="sans-serif">Express + WS</text>
      
      <path d="M330 100 L400 100" stroke="#94A3B8" stroke-width="2"/>
      
      <rect x="400" y="70" width="80" height="60" rx="10" fill="#10B981" fill-opacity="0.2" stroke="#34D399" stroke-width="2"/>
      <text x="440" y="105" text-anchor="middle" fill="#059669" font-size="13" font-family="sans-serif" font-weight="bold">Vercel/Git</text>
    </svg>
  </div>
  <p class="text-xs text-slate-500 dark:text-slate-400 mt-3">Double-click title to edit name directly in live preview, or click "Edit Diagram" to launch editor.</p>
</div>`
  },

  // MEDIA & CUSTOM
  {
    id: 'code-block-snippet',
    name: 'Syntax Highlighted Code Block',
    category: 'custom',
    icon: 'Code',
    description: 'Formatted code block with copy button header',
    html: `<div class="my-6 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
  <div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
    <span>script.js</span>
    <button class="hover:text-white transition-colors" onclick="navigator.clipboard.writeText('console.log(&quot;Hello ApexStudio!&quot;);')">Copy</button>
  </div>
  <pre class="p-4 text-slate-200 overflow-x-auto"><code>// ApexStudio Interactive Script
document.addEventListener('DOMContentLoaded', () => {
  console.log('Project loaded successfully!');
});</code></pre>
</div>`
  }
];

export const INITIAL_DEFAULT_FILES = [
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
</html>`
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

/* Selected Element Highlight in WYSIWYG Mode */
.apex-selected-element {
  outline: 2px dashed #6366f1 !important;
  outline-offset: 2px !important;
  position: relative;
}
`
  },
  {
    id: 'script-js',
    name: 'script.js',
    type: 'js' as const,
    path: '/script.js',
    content: `// ApexStudio Client Script
document.addEventListener('DOMContentLoaded', () => {
  console.log('⚡ ApexStudio Interactive Canvas Initialized');

  const ctaBtn = document.getElementById('cta-btn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      alert('🚀 Launching Cloud Deployment Pipeline!');
    });
  }
});`
  }
];
