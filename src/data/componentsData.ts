import { ComponentTemplate } from '../types';

export const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  // LAYOUT
  {
    id: 'hero-modern',
    name: 'Hero Section Layouts',
    category: 'layout',
    icon: 'Sparkles',
    description: 'Hero header layouts with multiple style variants: Modern SaaS, Split 2-Column Showcase, Minimalist Editorial, and Dark Cyberpunk',
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
</section>`,
    variants: [
      {
        id: 'hero-modern-saas',
        name: 'Modern SaaS Centered',
        description: 'Centered title with gradient text, badge, dual CTA buttons, and spacious margin',
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
        id: 'hero-split-showcase',
        name: 'Split 2-Column Showcase',
        description: '2-Column layout with headline & feature checkmarks on left, terminal/dashboard preview on right',
        html: `<section class="py-16 px-6 max-w-7xl mx-auto">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <div class="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold mb-4">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Version 3.0 Live Now</span>
      </div>
      <h1 class="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
        Empower Your Development Workflow with Visual IDE
      </h1>
      <p class="text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
        Seamlessly blend visual WYSIWYG editing, draw.io diagrams, code editing, and instant archive management into one powerful workspace.
      </p>
      <ul class="space-y-3 mb-8 text-sm text-slate-700 dark:text-slate-300 font-medium">
        <li class="flex items-center space-x-2.5">
          <span class="w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">✓</span>
          <span>Instant drag-and-drop element positioning & live sync</span>
        </li>
        <li class="flex items-center space-x-2.5">
          <span class="w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">✓</span>
          <span>Multi-cloud one-click deployments (Vercel, Netlify, Cloud Run)</span>
        </li>
        <li class="flex items-center space-x-2.5">
          <span class="w-5 h-5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">✓</span>
          <span>Real-time multi-user editing with cursor presence</span>
        </li>
      </ul>
      <div class="flex items-center space-x-4">
        <button class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all">Launch Editor</button>
        <button class="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm rounded-xl border border-slate-200 dark:border-slate-700 transition-all">Explore Docs</button>
      </div>
    </div>
    <div class="relative">
      <div class="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div class="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div class="flex space-x-2">
            <span class="w-3 h-3 rounded-full bg-rose-500"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
          </div>
          <span class="text-xs font-mono text-slate-500">app.apexstudio.dev</span>
        </div>
        <div class="space-y-3 font-mono text-xs">
          <div class="p-3 bg-slate-950/80 rounded-lg text-emerald-400 border border-slate-800">
            $ apex deploy --provider vercel --env production
          </div>
          <div class="text-slate-400 text-[11px] leading-relaxed">
            ✔ Building production bundle (HTML, Tailwind CSS, JS)...<br/>
            ✔ Deploying 24 static assets to edge network...<br/>
            ✔ SSL Certificate auto-provisioned.<br/>
            <span class="text-indigo-400 font-bold">🚀 Deployment Live: https://apex-studio-pro.vercel.app</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`
      },
      {
        id: 'hero-minimal-editorial',
        name: 'Minimalist Editorial',
        description: 'Clean typography, high contrast, elegant spacing, single CTA',
        html: `<section class="py-20 px-6 max-w-4xl mx-auto text-center font-sans">
  <p class="text-xs uppercase tracking-widest text-indigo-500 font-semibold mb-3">Simple & Purposeful</p>
  <h1 class="text-5xl md:text-7xl font-light text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
    Design without <span class="font-bold underline decoration-indigo-500 decoration-wavy">friction</span>.
  </h1>
  <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
    Create breathtaking digital experiences with zero boilerplate overhead. Clean code output, pure standard HTML & CSS.
  </p>
  <div>
    <a href="#start" class="inline-block px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-full hover:opacity-90 transition-opacity shadow-lg">
      Start Creating Now →
    </a>
  </div>
</section>`
      },
      {
        id: 'hero-dark-cyberpunk',
        name: 'Dark Cyberpunk Tech',
        description: 'Glowing dark theme backdrop with search bar CTA and live metrics stat counters',
        html: `<section class="py-20 px-6 max-w-6xl mx-auto text-center bg-slate-950 text-white rounded-3xl border border-indigo-900/40 shadow-2xl relative overflow-hidden my-6">
  <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none"></div>
  <div class="relative z-10">
    <span class="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-mono font-semibold mb-6">
      <span>⚡ CLOUD NATIVE PLATFORM</span>
    </span>
    <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
      Deploy Fullstack Apps <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">At Warp Speed</span>
    </h1>
    <p class="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-mono text-xs">
      Instant serverless endpoints, automated Git syncing, and real-time collaborative preview canvases.
    </p>

    <!-- Search / CTA Input -->
    <div class="max-w-md mx-auto flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-xl mb-12">
      <input type="text" placeholder="Enter project name..." class="flex-1 bg-transparent px-4 py-2 text-xs text-white focus:outline-none placeholder-slate-500 font-mono" />
      <button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer">
        Create App
      </button>
    </div>

    <!-- Live Metrics Counter Row -->
    <div class="grid grid-cols-3 gap-6 max-w-3xl mx-auto pt-8 border-t border-slate-900/80 font-mono">
      <div>
        <div class="text-2xl md:text-3xl font-black text-cyan-400">99.99%</div>
        <div class="text-[11px] text-slate-500 uppercase mt-1">Uptime SLA</div>
      </div>
      <div>
        <div class="text-2xl md:text-3xl font-black text-indigo-400">10M+</div>
        <div class="text-[11px] text-slate-500 uppercase mt-1">Daily Requests</div>
      </div>
      <div>
        <div class="text-2xl md:text-3xl font-black text-purple-400">&lt;50ms</div>
        <div class="text-[11px] text-slate-500 uppercase mt-1">Global Latency</div>
      </div>
    </div>
  </div>
</section>`
      }
    ]
  },
  {
    id: 'navbar-sleek',
    name: 'Navigation Bar Styles',
    category: 'layout',
    icon: 'Navigation',
    description: 'Header navigation templates with multiple variants: Sleek Centered, Search + Actions, Dark Floating Glass, and Mega-Menu',
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
</header>`,
    variants: [
      {
        id: 'navbar-sleek-centered',
        name: 'Sleek Centered Nav',
        description: 'Brand logo on left, centered navigation links, Sign In & Get Started actions on right',
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
        id: 'navbar-search-actions',
        name: 'Brand Left + Search Bar',
        description: 'Header with integrated search input box, quick documentation links, and user profile avatar',
        html: `<header class="w-full bg-slate-900 text-white border-b border-slate-800 px-6 py-3 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
    <div class="flex items-center space-x-6">
      <div class="flex items-center space-x-2.5">
        <span class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-sm">⚡</span>
        <span class="font-bold text-lg tracking-tight">ApexCloud</span>
      </div>
      <div class="hidden md:flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 w-72">
        <span class="text-slate-500 text-xs mr-2">🔍</span>
        <input type="text" placeholder="Search docs, APIs, components..." class="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none" />
        <span class="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-mono">⌘K</span>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <a href="#docs" class="text-xs text-slate-300 hover:text-white font-medium">Documentation</a>
      <a href="#status" class="text-xs text-emerald-400 font-medium flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>All Systems Operational</span>
      </a>
      <button class="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-md">
        JS
      </button>
    </div>
  </div>
</header>`
      },
      {
        id: 'navbar-floating-pill',
        name: 'Dark Floating Glassmorphism',
        description: 'Rounded floating navbar pill with backdrop blur, shadow, and status indicator',
        html: `<div class="w-full py-4 px-6 sticky top-2 z-50">
  <header class="max-w-5xl mx-auto bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 shadow-2xl flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
        ★
      </div>
      <span class="font-bold text-sm text-white tracking-tight">Apex Studio</span>
    </div>
    <nav class="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
      <a href="#overview" class="hover:text-white transition-colors">Overview</a>
      <a href="#showcase" class="hover:text-white transition-colors">Showcase</a>
      <a href="#pricing" class="hover:text-white transition-colors">Pricing</a>
      <a href="#changelog" class="hover:text-white transition-colors">Changelog</a>
    </nav>
    <div class="flex items-center space-x-3">
      <button class="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white">Log In</button>
      <button class="px-4 py-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-full shadow-md transition-all">Try Free</button>
    </div>
  </header>
</div>`
      },
      {
        id: 'navbar-mega-menu',
        name: 'Mega-Menu Header',
        description: 'Navigation header with dropdown menu link categories, notifications, and status badge',
        html: `<header class="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <div class="flex items-center space-x-8">
      <div class="font-extrabold text-indigo-600 dark:text-indigo-400 text-xl tracking-tight">ApexStudio Pro</div>
      <nav class="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div class="relative group cursor-pointer py-2">
          <span class="flex items-center space-x-1 group-hover:text-indigo-600">
            <span>Products</span>
            <span>▾</span>
          </span>
        </div>
        <div class="relative group cursor-pointer py-2">
          <span class="flex items-center space-x-1 group-hover:text-indigo-600">
            <span>Solutions</span>
            <span>▾</span>
          </span>
        </div>
        <a href="#pricing" class="hover:text-indigo-600">Pricing</a>
        <a href="#enterprise" class="hover:text-indigo-600">Enterprise</a>
      </nav>
    </div>
    <div class="flex items-center space-x-3 text-xs">
      <button class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">🔔</button>
      <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm">Dashboard</button>
    </div>
  </div>
</header>`
      }
    ]
  },
  {
    id: 'feature-3col',
    name: 'Feature Section Layouts',
    category: 'layout',
    icon: 'LayoutGrid',
    description: 'Feature display sections with multiple variants: 3-Column Cards, Bento Grid Layout, and Alternating Zig-Zag Rows',
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
</section>`,
    variants: [
      {
        id: 'feature-3col-classic',
        name: 'Classic 3-Column Grid',
        description: '3-Column equal width grid cards with icons, title, description and subtle border hover',
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
        id: 'feature-bento-grid',
        name: 'Asymmetric Bento Box',
        description: 'Modern bento grid with 1 primary feature box and 3 compact stat cards',
        html: `<section class="py-12 px-6 max-w-6xl mx-auto">
  <div class="mb-10">
    <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">PLATFORM HIGHLIGHTS</span>
    <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Bento Grid Feature Matrix</h2>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="md:col-span-2 p-8 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl border border-indigo-800/50 shadow-xl flex flex-col justify-between min-h-[260px]">
      <div>
        <span class="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono font-semibold">FLAGSHIP</span>
        <h3 class="text-2xl font-bold mt-4 mb-2">Bi-Directional Code & Canvas Sync</h3>
        <p class="text-sm text-slate-300 max-w-md leading-relaxed">
          Edits made in the WYSIWYG canvas instantly update HTML files, while manual code edits render in real-time in the canvas.
        </p>
      </div>
      <div class="pt-6 font-mono text-xs text-indigo-400 flex items-center space-x-2">
        <span>● Live AST Synchronizer Active</span>
      </div>
    </div>
    <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div class="text-3xl font-black text-indigo-600 dark:text-indigo-400">0.02s</div>
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white text-sm">Instant Refresh</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Zero latency hot module reloads.</p>
      </div>
    </div>
    <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div class="text-3xl font-black text-emerald-500">25+</div>
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white text-sm">Deploy Providers</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Vercel, Netlify, Cloud Run & Git.</p>
      </div>
    </div>
    <div class="md:col-span-2 p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-sm flex items-center justify-between">
      <div>
        <h4 class="font-bold text-sm">Tar.zst Compressed Export</h4>
        <p class="text-xs text-slate-400 mt-0.5">Full multi-file workspace compression in one click.</p>
      </div>
      <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md">Export Now</button>
    </div>
  </div>
</section>`
      },
      {
        id: 'feature-zigzag-rows',
        name: 'Zig-Zag Alternating Rows',
        description: 'Row-by-row feature breakdown with alternating left/right layout',
        html: `<section class="py-16 px-6 max-w-6xl mx-auto space-y-16">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <div>
      <span class="text-xs font-bold text-indigo-500 uppercase tracking-wider">VISUAL CANVAS</span>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Drag-and-Drop Component Library</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Select from dozens of pre-designed Tailwind components or drag custom variants straight into your active HTML canvas.
      </p>
    </div>
    <div class="p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs font-mono text-slate-500">
      [ Visual Canvas Preview Placeholder ]
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <div class="order-2 md:order-1 p-6 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs font-mono text-slate-500">
      [ Draw.io Editor Integration Placeholder ]
    </div>
    <div class="order-1 md:order-2">
      <span class="text-xs font-bold text-purple-500 uppercase tracking-wider">DIAGRAMMING</span>
      <h3 class="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-3">Native Draw.io Architecture Editor</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Embed XML/SVG flowcharts directly in your web app with instant double-click editing.
      </p>
    </div>
  </div>
</section>`
      }
    ]
  },
  {
    id: 'footer-clean',
    name: 'Footer Section Layouts',
    category: 'layout',
    icon: 'PanelBottom',
    description: 'Footer layouts with multiple variants: 4-Column SaaS Footer, Centered Minimalist, and Newsletter Subscription Footer',
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
</footer>`,
    variants: [
      {
        id: 'footer-4col-saas',
        name: '4-Column Modern SaaS',
        description: 'Brand column with description + 3 category link columns + copyright divider',
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
      {
        id: 'footer-centered-minimal',
        name: 'Centered Minimalist',
        description: 'Centered brand logo, single row horizontal navigation links, social icons',
        html: `<footer class="bg-slate-950 text-slate-400 py-10 px-6 border-t border-slate-900 text-center font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="font-extrabold text-white text-xl tracking-tight">ApexStudio</div>
    <div class="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-300">
      <a href="#about" class="hover:text-white">About</a>
      <a href="#features" class="hover:text-white">Features</a>
      <a href="#docs" class="hover:text-white">Docs</a>
      <a href="#privacy" class="hover:text-white">Privacy</a>
      <a href="#terms" class="hover:text-white">Terms</a>
    </div>
    <div class="text-[11px] text-slate-500">
      © 2026 ApexStudio Technologies Inc. All rights reserved.
    </div>
  </div>
</footer>`
      },
      {
        id: 'footer-newsletter-split',
        name: 'Newsletter Subscription',
        description: 'Split footer with email newsletter signup input box and status badge',
        html: `<footer class="bg-slate-900 text-slate-300 py-12 px-6 border-t border-slate-800">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-8 border-b border-slate-800 items-center">
    <div>
      <h3 class="text-xl font-bold text-white">Subscribe to platform updates</h3>
      <p class="text-xs text-slate-400 mt-1">Get monthly updates on new components, cloud integrations, and feature releases.</p>
    </div>
    <div class="flex items-center space-x-2">
      <input type="email" placeholder="Enter your email address..." class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
      <button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md whitespace-nowrap">Subscribe</button>
    </div>
  </div>
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
    <div>© 2026 ApexStudio. Built for high-performance web engineering.</div>
    <div class="flex items-center space-x-4">
      <a href="#terms" class="hover:text-slate-300">Terms</a>
      <a href="#privacy" class="hover:text-slate-300">Privacy</a>
      <a href="#security" class="hover:text-slate-300">Security</a>
    </div>
  </div>
</footer>`
      }
    ]
  },
  {
    id: 'impressum-footer',
    name: 'Impressum Legal Footer',
    category: 'layout',
    icon: 'FileText',
    description: 'EU & German compliant legal Impressum footer with company details, contact info, register ID, tax number, and legal links',
    html: `<footer class="bg-slate-900 text-slate-300 py-12 px-6 border-t border-slate-800 font-sans my-4">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
    <!-- Company & Legal Info -->
    <div class="space-y-3">
      <div class="flex items-center space-x-2 text-white font-bold text-lg">
        <span class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm shadow-sm">⚖️</span>
        <span>Impressum / Legal Notice</span>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">
        Angaben gemäß § 5 Digital-Dienste-Gesetz (DDG) / Information in accordance with EU & German legal guidelines.
      </p>
      <div class="text-xs space-y-1 text-slate-300 border-l-2 border-indigo-500 pl-3 py-1 bg-slate-950/40 rounded-r-lg">
        <p class="font-semibold text-white">ApexStudio Technologies GmbH</p>
        <p>Musterstraße 42</p>
        <p>10115 Berlin, Deutschland</p>
      </div>
    </div>

    <!-- Contact & Register Details -->
    <div class="space-y-3">
      <h4 class="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Vertretung & Kontakt</h4>
      <div class="text-xs space-y-1.5 text-slate-400">
        <p><strong class="text-slate-200">Vertreten durch:</strong> Max Mustermann (Geschäftsführer)</p>
        <p><strong class="text-slate-200">Telefon:</strong> +49 (0) 30 12345678</p>
        <p><strong class="text-slate-200">E-Mail:</strong> <a href="mailto:impressum@example.com" class="text-indigo-400 hover:underline">impressum@example.com</a></p>
        <p><strong class="text-slate-200">Registergericht:</strong> Amtsgericht Berlin-Charlottenburg</p>
        <p><strong class="text-slate-200">Registernummer:</strong> HRB 123456 B</p>
        <p><strong class="text-slate-200">Umsatzsteuer-ID:</strong> DE 987654321</p>
      </div>
    </div>

    <!-- Legal Disclaimers & Links -->
    <div class="space-y-3">
      <h4 class="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Rechtliche Hinweise</h4>
      <ul class="text-xs space-y-2 text-slate-400">
        <li><a href="#impressum" class="hover:text-white transition-colors flex items-center space-x-1.5"><span class="text-indigo-400">•</span><span>Impressum</span></a></li>
        <li><a href="#datenschutz" class="hover:text-white transition-colors flex items-center space-x-1.5"><span class="text-indigo-400">•</span><span>Datenschutzerklärung (Privacy Policy)</span></a></li>
        <li><a href="#agb" class="hover:text-white transition-colors flex items-center space-x-1.5"><span class="text-indigo-400">•</span><span>Allgemeine Geschäftsbedingungen (AGB)</span></a></li>
        <li><a href="#cookies" class="hover:text-white transition-colors flex items-center space-x-1.5"><span class="text-indigo-400">•</span><span>Cookie-Einstellungen</span></a></li>
        <li><a href="#disclaimer" class="hover:text-white transition-colors flex items-center space-x-1.5"><span class="text-indigo-400">•</span><span>Haftungsausschluss (Disclaimer)</span></a></li>
      </ul>
    </div>
  </div>

  <div class="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
    <p>© 2026 ApexStudio Technologies GmbH. Alle Rechte vorbehalten.</p>
    <div class="flex items-center space-x-4">
      <a href="#impressum" class="hover:text-slate-300">Impressum</a>
      <span>•</span>
      <a href="#datenschutz" class="hover:text-slate-300">Datenschutz</a>
      <span>•</span>
      <a href="#agb" class="hover:text-slate-300">AGB</a>
    </div>
  </div>
</footer>`
  },
  {
    id: 'data-table-modern',
    name: 'Responsive Data Table',
    category: 'ui',
    icon: 'Table',
    description: 'Data table with search field, badge status tags, row actions, hover highlight, and pagination controls',
    html: `<div class="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden font-sans my-6">
  <!-- Table Header Bar -->
  <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/40">
    <div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
        <span>📊 Project Deployment Directory</span>
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overview of active application instances, cloud providers, and system status health.</p>
    </div>
    <div class="flex items-center space-x-3">
      <div class="relative">
        <input 
          type="text" 
          placeholder="Search items..." 
          class="w-48 sm:w-64 px-3.5 py-1.5 pl-8 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
        />
        <span class="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
      </div>
      <button class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer">
        <span>+ Add Row</span>
      </button>
    </div>
  </div>

  <!-- Responsive Table Container -->
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse text-xs">
      <thead>
        <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
          <th class="py-3.5 px-4">Project Name</th>
          <th class="py-3.5 px-4">Cloud Provider</th>
          <th class="py-3.5 px-4">Environment</th>
          <th class="py-3.5 px-4">Status</th>
          <th class="py-3.5 px-4">Last Sync</th>
          <th class="py-3.5 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
        <!-- Row 1 -->
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
            <div class="flex items-center space-x-2.5">
              <span class="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">A</span>
              <div>
                <div class="font-bold">ApexStudio App</div>
                <div class="text-[10px] text-slate-400 font-mono">v2.4.0 • production</div>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center space-x-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-md font-medium text-[11px] border border-blue-500/20">
              <span>☁️ Cloud Run</span>
            </span>
          </td>
          <td class="py-3.5 px-4 font-mono text-[11px]">Production</td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Healthy</span>
            </span>
          </td>
          <td class="py-3.5 px-4 text-slate-500 font-mono text-[11px]">2 mins ago</td>
          <td class="py-3.5 px-4 text-right">
            <button class="px-2.5 py-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer">Edit</button>
          </td>
        </tr>

        <!-- Row 2 -->
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
            <div class="flex items-center space-x-2.5">
              <span class="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">L</span>
              <div>
                <div class="font-bold">Lambda Microservice</div>
                <div class="text-[10px] text-slate-400 font-mono">v1.8.2 • serverless</div>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-md font-medium text-[11px] border border-amber-500/20">
              <span>🟧 AWS Lambda</span>
            </span>
          </td>
          <td class="py-3.5 px-4 font-mono text-[11px]">Staging</td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Active</span>
            </span>
          </td>
          <td class="py-3.5 px-4 text-slate-500 font-mono text-[11px]">1 hour ago</td>
          <td class="py-3.5 px-4 text-right">
            <button class="px-2.5 py-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer">Edit</button>
          </td>
        </tr>

        <!-- Row 3 -->
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
            <div class="flex items-center space-x-2.5">
              <span class="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-xs">D</span>
              <div>
                <div class="font-bold">Dropbox Storage Sync</div>
                <div class="text-[10px] text-slate-400 font-mono">v3.0.1 • storage</div>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center space-x-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-md font-medium text-[11px] border border-purple-500/20">
              <span>🔹 Dropbox Storage</span>
            </span>
          </td>
          <td class="py-3.5 px-4 font-mono text-[11px]">Development</td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Syncing</span>
            </span>
          </td>
          <td class="py-3.5 px-4 text-slate-500 font-mono text-[11px]">Yesterday</td>
          <td class="py-3.5 px-4 text-right">
            <button class="px-2.5 py-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Table Pagination Footer -->
  <div class="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
    <span>Showing <strong>3</strong> of <strong>24</strong> entries</span>
    <div class="flex items-center space-x-2">
      <button class="px-3 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium transition-colors cursor-pointer">Previous</button>
      <button class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors cursor-pointer">Next</button>
    </div>
  </div>
</div>`
  },

  // UI ELEMENTS & BUTTONS
  {
    id: 'link-styled-arrow',
    name: 'Interactive Arrow Link',
    category: 'ui',
    icon: 'SquareMousePointer',
    description: 'Text hyperlink with animated hover arrow icon and clean focus states',
    html: `<a href="#features" class="inline-flex items-center space-x-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-all group">
  <span>Explore All Features</span>
  <span class="transform group-hover:translate-x-1 transition-transform">→</span>
</a>`
  },
  {
    id: 'link-cta-button',
    name: 'Call-to-Action Link Button',
    category: 'ui',
    icon: 'SquareMousePointer',
    description: 'Primary CTA link button (<a href="...">) with hover elevation shadow',
    html: `<a href="#get-started" class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5">
  Get Started Free
</a>`
  },
  {
    id: 'link-anchor-smooth',
    name: 'Page Section Anchor Link',
    category: 'ui',
    icon: 'Tag',
    description: 'Page section jump anchor link pointing to a section ID (#pricing)',
    html: `<a href="#pricing" class="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-lg border border-slate-200 dark:border-slate-700 transition-all">
  <span>⚓</span>
  <span>Jump to Pricing (#pricing)</span>
</a>`
  },
  {
    id: 'link-contact-mailto',
    name: 'Direct Email Support Link',
    category: 'ui',
    icon: 'Mail',
    description: 'Email hyperlink opening default mail client (mailto:support@example.com)',
    html: `<a href="mailto:support@example.com" class="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 font-semibold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all">
  <span>✉️</span>
  <span>Contact Support (support@example.com)</span>
</a>`
  },
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
    name: 'Media Card (Image)',
    category: 'media',
    icon: 'CreditCard',
    description: 'Image top card with upload button and support for .jxl, .png, .jpg, .webp, .svg, .gif, .avif formats',
    html: `<div class="max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow media-card group relative">
  <div class="relative overflow-hidden media-container bg-slate-100 dark:bg-slate-950">
    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" alt="Code preview" class="w-full h-48 object-cover media-element" />
    <button type="button" data-action="upload-media" class="media-upload-btn absolute top-3 right-3 opacity-90 hover:opacity-100 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold backdrop-blur border border-slate-700/60 shadow-md transition-all flex items-center space-x-1.5 cursor-pointer">
      <span>📁 Upload / Drop Media</span>
    </button>
  </div>
  <div class="p-6">
    <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Image Media</span>
    <h3 class="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-2">Building Clean UI Architectures</h3>
    <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">Drag & drop image or video files onto this card or click Upload. Supports JXL, PNG, JPG, WebP, SVG, GIF, MP4, WebM.</p>
    <a href="#" class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center space-x-1">
      <span>Read Article</span>
      <span>→</span>
    </a>
  </div>
</div>`
  },
  {
    id: 'card-media-video',
    name: 'Media Card (Video Player)',
    category: 'media',
    icon: 'Film',
    description: 'HTML5 Video player card supporting MP4, WebM, Ogg, MOV formats, drag & drop, and controls',
    html: `<div class="max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow media-card group relative">
  <div class="relative overflow-hidden media-container bg-slate-950">
    <video controls class="w-full h-52 object-cover media-element" poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80">
      <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4">
      Your browser does not support video playback.
    </video>
    <button type="button" data-action="upload-media" class="media-upload-btn absolute top-3 right-3 opacity-90 hover:opacity-100 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold backdrop-blur border border-slate-700/60 shadow-md transition-all flex items-center space-x-1.5 cursor-pointer">
      <span>🎬 Upload / Drop Video</span>
    </button>
  </div>
  <div class="p-6">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">HTML5 Video</span>
      <span class="text-[10px] px-2.5 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full font-semibold border border-purple-500/30">MP4 / WebM / MOV</span>
    </div>
    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Interactive Video Card</h3>
    <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">Supports local video upload (.mp4, .webm, .mov, .ogg), drag & drop file replacement, and customizable HTML5 video controls.</p>
  </div>
</div>`
  },
  {
    id: 'media-docs-card',
    name: 'Media Formats Documentation Card',
    category: 'media',
    icon: 'Film',
    description: 'Complete documentation card listing all supported video and image formats and specs',
    html: `<div class="max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm my-6 font-sans">
  <div class="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
    <div class="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-base">
      <span>🎬 Media & Video Format Specs</span>
    </div>
    <span class="text-xs px-2.5 py-1 bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full font-medium border border-purple-500/30">Docs Guide</span>
  </div>

  <div class="space-y-4 text-xs text-slate-600 dark:text-slate-300">
    <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
      <h4 class="font-bold text-purple-600 dark:text-purple-400 text-sm mb-1.5">🎥 Supported Video Formats</h4>
      <ul class="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
        <li><strong class="text-slate-900 dark:text-white">MP4 (.mp4)</strong>: H.264 Video + AAC Audio (Universal support)</li>
        <li><strong class="text-slate-900 dark:text-white">WebM (.webm)</strong>: VP8 / VP9 / AV1 (Optimized web video)</li>
        <li><strong class="text-slate-900 dark:text-white">Ogg (.ogg, .ogv)</strong>: Theora Video + Vorbis Audio</li>
        <li><strong class="text-slate-900 dark:text-white">QuickTime (.mov, .m4v)</strong>: MPEG-4 container formats</li>
        <li><strong class="text-slate-900 dark:text-white">Direct URLs & Data</strong>: Remote HTTP/HTTPS links & Base64 Data URLs</li>
      </ul>
    </div>

    <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
      <h4 class="font-bold text-indigo-600 dark:text-indigo-400 text-sm mb-1.5">🖼️ Supported Image Formats</h4>
      <ul class="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
        <li><strong class="text-slate-900 dark:text-white">JPEG XL (.jxl)</strong>: Next-generation high efficiency & lossless image format</li>
        <li><strong class="text-slate-900 dark:text-white">JPEG 2000 (.jp2, .j2k)</strong>: Native support in Safari & WebKit browsers</li>
        <li><strong class="text-slate-900 dark:text-white">PNG (.png)</strong>: High quality with full alpha transparency</li>
        <li><strong class="text-slate-900 dark:text-white">JPEG (.jpg, .jpeg)</strong>: Standard web imagery</li>
        <li><strong class="text-slate-900 dark:text-white">WebP (.webp)</strong>: Next-gen compressed web format</li>
        <li><strong class="text-slate-900 dark:text-white">SVG (.svg)</strong>: Scalable vector graphics</li>
        <li><strong class="text-slate-900 dark:text-white">GIF (.gif)</strong>: Animated graphics</li>
        <li><strong class="text-slate-900 dark:text-white">AVIF, BMP, ICO</strong>: AV1 image files & icon graphics</li>
      </ul>
    </div>
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
  {
    id: 'marquee-scroller-rtl',
    name: 'Scrolling Text Marquee (Right-to-Left)',
    category: 'ui',
    icon: 'MoveHorizontal',
    description: 'Continuous right-to-left scrolling text marquee ticker banner with pause-on-hover and gradient edge masks',
    html: `<div class="w-full bg-slate-900 text-slate-100 py-3.5 border-y border-slate-800 overflow-hidden relative shadow-md font-sans group">
  <!-- Gradient Edge Fade Overlay -->
  <div class="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
  <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>

  <style>
    @keyframes apexMarqueeRTL {
      0% { transform: translate3d(0, 0, 0); }
      100% { transform: translate3d(-50%, 0, 0); }
    }
    .apex-marquee-track {
      display: flex;
      width: max-content;
      animation: apexMarqueeRTL 24s linear infinite;
      will-change: transform;
    }
    .apex-marquee-track:hover {
      animation-play-state: paused;
    }
  </style>

  <div class="apex-marquee-track flex items-center space-x-8 text-xs md:text-sm font-medium">
    <!-- Sequence 1 -->
    <div class="flex items-center space-x-8 shrink-0">
      <span class="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-semibold tracking-wide text-xs">
        <span class="animate-pulse">⚡</span>
        <span>LIVE ANNOUNCEMENT</span>
      </span>
      <span class="text-slate-200">🚀 ApexStudio 2.0 Released — Instant Visual & Code Builder</span>
      <span class="text-indigo-400 font-bold">✦</span>
      <span class="text-slate-300">🖼️ Support added for JXL, JPEG 2000, WebP, SVG, AVIF, PNG & JPG formats</span>
      <span class="text-purple-400 font-bold">✦</span>
      <span class="text-slate-200">📊 Live interactive Draw.io vector architecture diagrams</span>
      <span class="text-emerald-400 font-bold">✦</span>
      <span class="text-slate-300">🌐 1-Click export to GitHub, Vercel, Netlify & .tar.zst archives</span>
      <span class="text-amber-400 font-bold">✦</span>
    </div>

    <!-- Sequence 2 (Duplicated for seamless continuous loop) -->
    <div class="flex items-center space-x-8 shrink-0" aria-hidden="true">
      <span class="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-semibold tracking-wide text-xs">
        <span class="animate-pulse">⚡</span>
        <span>LIVE ANNOUNCEMENT</span>
      </span>
      <span class="text-slate-200">🚀 ApexStudio 2.0 Released — Instant Visual & Code Builder</span>
      <span class="text-indigo-400 font-bold">✦</span>
      <span class="text-slate-300">🖼️ Support added for JXL, JPEG 2000, WebP, SVG, AVIF, PNG & JPG formats</span>
      <span class="text-purple-400 font-bold">✦</span>
      <span class="text-slate-200">📊 Live interactive Draw.io vector architecture diagrams</span>
      <span class="text-emerald-400 font-bold">✦</span>
      <span class="text-slate-300">🌐 1-Click export to GitHub, Vercel, Netlify & .tar.zst archives</span>
      <span class="text-amber-400 font-bold">✦</span>
    </div>
  </div>
</div>`
  },
  {
    id: 'js-marquee-ticker-rtl',
    name: 'Interactive JS Right-to-Left Ticker Bar',
    category: 'ui',
    icon: 'MoveHorizontal',
    description: 'News ticker banner with right-to-left scrolling text, badge tags, and pause control',
    html: `<div class="w-full bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-indigo-100 py-3 px-4 border-y border-indigo-800/60 shadow-lg font-sans my-4">
  <div class="flex items-center justify-between mb-2 pb-2 border-b border-indigo-800/40">
    <div class="flex items-center space-x-2 text-xs font-bold text-indigo-300">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
      <span class="uppercase tracking-wider text-[11px]">Right-to-Left Ticker</span>
    </div>
    <span class="text-[10px] text-indigo-300/70 font-mono">Hover to pause • Smooth RHS ➔ LHS</span>
  </div>

  <div class="w-full overflow-hidden relative py-1">
    <style>
      @keyframes tickerRTL {
        0% { transform: translate3d(100%, 0, 0); }
        100% { transform: translate3d(-100%, 0, 0); }
      }
      .animate-ticker-rtl {
        display: inline-block;
        white-space: nowrap;
        animation: tickerRTL 18s linear infinite;
        will-change: transform;
      }
      .animate-ticker-rtl:hover {
        animation-play-state: paused;
      }
    </style>
    <div class="animate-ticker-rtl text-sm font-medium text-white space-x-8">
      <span>🎉 Welcome to the Right-to-Left Ticker Banner!</span>
      <span class="text-indigo-400 font-bold">•</span>
      <span>Continuous JavaScript & CSS right-to-left scrolling animation</span>
      <span class="text-purple-400 font-bold">•</span>
      <span>Hover anywhere on this banner to pause text movement</span>
      <span class="text-emerald-400 font-bold">•</span>
      <span>Fully customizable text, animation duration, and color styling</span>
    </div>
  </div>
</div>`
  },
  {
    id: 'countdown-timer-interactive',
    name: 'Interactive Countdown Timer',
    category: 'ui',
    icon: 'Timer',
    description: 'Customizable countdown timer card with datetime-local picker, quick presets (+1h, +1d, +7d, +30d), digital cards, and real-time JavaScript timer.',
    html: `<div class="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl font-sans text-slate-900 dark:text-white my-6 apex-countdown-card relative overflow-hidden">
  <div class="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-5">
    <div>
      <div class="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
        <span>⏳ Countdown Timer</span>
      </div>
      <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">Event & Target Time Countdown</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Select a target date and time to calculate live remaining time.</p>
    </div>

    <div class="flex flex-col items-start sm:items-end space-y-1">
      <label class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Target Date & Time:</label>
      <input 
        type="datetime-local" 
        class="apex-target-datetime bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono shadow-inner cursor-pointer" 
      />
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-2 mb-6 text-xs">
    <span class="text-slate-500 dark:text-slate-400 font-medium text-[11px] mr-1">Quick Presets:</span>
    <button type="button" class="preset-btn px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer" data-hours="1">+1 Hour</button>
    <button type="button" class="preset-btn px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer" data-days="1">+1 Day</button>
    <button type="button" class="preset-btn px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer" data-days="7">+7 Days</button>
    <button type="button" class="preset-btn px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer" data-days="30">+30 Days</button>
    <button type="button" class="preset-btn px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white rounded-lg font-medium transition-colors cursor-pointer" data-newyear="true">🎉 New Year 2027</button>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center my-4">
    <div class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm">
      <div class="text-3xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight days-val">00</div>
      <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Days</div>
    </div>
    <div class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm">
      <div class="text-3xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight hours-val">00</div>
      <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Hours</div>
    </div>
    <div class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm">
      <div class="text-3xl md:text-5xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight minutes-val">00</div>
      <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Minutes</div>
    </div>
    <div class="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm">
      <div class="text-3xl md:text-5xl font-black text-purple-600 dark:text-purple-400 font-mono tracking-tight seconds-val animate-pulse">00</div>
      <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Seconds</div>
    </div>
  </div>

  <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
    <div class="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
      <span class="font-medium countdown-status">Countdown active...</span>
    </div>
    <span class="font-mono text-slate-400 dark:text-slate-500 text-[11px] target-formatted-date"></span>
  </div>

  <script>
    (function() {
      const card = document.currentScript ? document.currentScript.closest('.apex-countdown-card') : document.querySelector('.apex-countdown-card');
      if (!card) return;

      const input = card.querySelector('.apex-target-datetime');
      const daysEl = card.querySelector('.days-val');
      const hoursEl = card.querySelector('.hours-val');
      const minutesEl = card.querySelector('.minutes-val');
      const secondsEl = card.querySelector('.seconds-val');
      const statusEl = card.querySelector('.countdown-status');
      const formattedEl = card.querySelector('.target-formatted-date');
      const presetBtns = card.querySelectorAll('.preset-btn');

      const pad = (n) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

      let targetDate = new Date(Date.now() + 7 * 24 * 3600 * 1000);

      function formatForInput(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return \`\${yyyy}-\${mm}-\${dd}T\${hh}:\${min}\`;
      }

      if (input) {
        input.value = formatForInput(targetDate);
        input.addEventListener('change', (e) => {
          if (e.target.value) {
            targetDate = new Date(e.target.value);
            tick();
          }
        });
      }

      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const now = new Date();
          if (btn.dataset.hours) targetDate = new Date(now.getTime() + parseInt(btn.dataset.hours) * 3600 * 1000);
          else if (btn.dataset.days) targetDate = new Date(now.getTime() + parseInt(btn.dataset.days) * 86400 * 1000);
          else if (btn.dataset.newyear) targetDate = new Date('2027-01-01T00:00:00');
          if (input) input.value = formatForInput(targetDate);
          tick();
        });
      });

      function tick() {
        const now = new Date().getTime();
        const diff = targetDate.getTime() - now;

        if (formattedEl) {
          formattedEl.textContent = targetDate.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
          });
        }

        if (diff <= 0) {
          if (daysEl) daysEl.textContent = '00';
          if (hoursEl) hoursEl.textContent = '00';
          if (minutesEl) minutesEl.textContent = '00';
          if (secondsEl) secondsEl.textContent = '00';
          if (statusEl) {
            statusEl.textContent = '🎉 Event Reached! Countdown finished.';
            statusEl.className = 'font-bold text-emerald-500 animate-bounce';
          }
          return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = pad(d);
        if (hoursEl) hoursEl.textContent = pad(h);
        if (minutesEl) minutesEl.textContent = pad(m);
        if (secondsEl) secondsEl.textContent = pad(s);
        if (statusEl) {
          statusEl.textContent = 'Countdown active...';
          statusEl.className = 'font-medium text-indigo-500';
        }
      }

      tick();
      setInterval(tick, 1000);
    })();
  </script>
</div>`
  },
  {
    id: 'browser-ip-address',
    name: 'Browser IP Address Inspector',
    category: 'ui',
    icon: 'Globe',
    description: 'Displays browser IP address, network details, geolocation, User-Agent info, copy button & refresh capability',
    html: `<div class="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl font-sans text-slate-900 dark:text-white my-6 apex-ip-card relative overflow-hidden">
  <div class="absolute -top-24 -right-24 w-56 h-56 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-24 -left-24 w-56 h-56 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Header -->
  <div class="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/20">
        🌐
      </div>
      <div>
        <h3 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Browser IP Address</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
            Online
          </span>
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Public IP detection and network diagnostics</p>
      </div>
    </div>

    <!-- Refresh Button -->
    <button type="button" class="ip-refresh-btn p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all shadow-sm active:scale-95 cursor-pointer" title="Refresh IP Address">
      <svg class="w-4 h-4 refresh-icon transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
    </button>
  </div>

  <!-- Main IP Display Card -->
  <div class="my-6 p-5 bg-gradient-to-br from-slate-50 to-cyan-50/30 dark:from-slate-950 dark:to-cyan-950/20 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
    <div class="flex flex-col text-center sm:text-left">
      <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Your Public IP Address</span>
      <div class="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-cyan-300 ip-address-text flex items-center justify-center sm:justify-start gap-2">
        <span class="animate-pulse text-slate-400">Loading IP...</span>
      </div>
    </div>

    <button type="button" class="ip-copy-btn px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center space-x-2 cursor-pointer shrink-0">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
      <span class="copy-btn-label">Copy IP</span>
    </button>
  </div>

  <!-- Details Grid -->
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
    <div class="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl">
      <span class="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">IP Type</span>
      <span class="font-mono font-semibold text-slate-800 dark:text-slate-200 ip-type-val">IPv4 / IPv6</span>
    </div>

    <div class="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl">
      <span class="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Location</span>
      <span class="font-semibold text-slate-800 dark:text-slate-200 ip-location-val">Detecting...</span>
    </div>

    <div class="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl col-span-2 sm:col-span-1">
      <span class="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider block mb-1">Network ISP</span>
      <span class="font-semibold text-slate-800 dark:text-slate-200 truncate block ip-isp-val">Detecting...</span>
    </div>
  </div>

  <!-- User Agent Footer -->
  <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
    <span class="truncate pr-2 font-mono ip-ua-text">Browser: ...</span>
    <span class="shrink-0 font-medium text-indigo-600 dark:text-indigo-400 ip-protocol-val">HTTPS</span>
  </div>

  <script>
    (function() {
      const card = document.currentScript ? document.currentScript.closest('.apex-ip-card') : document.querySelector('.apex-ip-card');
      if (!card) return;

      const ipTextEl = card.querySelector('.ip-address-text');
      const copyBtn = card.querySelector('.ip-copy-btn');
      const copyLabel = card.querySelector('.copy-btn-label');
      const refreshBtn = card.querySelector('.ip-refresh-btn');
      const refreshIcon = card.querySelector('.refresh-icon');
      const typeEl = card.querySelector('.ip-type-val');
      const locationEl = card.querySelector('.ip-location-val');
      const ispEl = card.querySelector('.ip-isp-val');
      const uaEl = card.querySelector('.ip-ua-text');
      const protocolEl = card.querySelector('.ip-protocol-val');

      let currentIP = '';

      if (uaEl) {
        const ua = navigator.userAgent;
        let browserName = 'Browser';
        if (ua.includes('Firefox')) browserName = 'Firefox';
        else if (ua.includes('Edg')) browserName = 'Edge';
        else if (ua.includes('Chrome')) browserName = 'Chrome';
        else if (ua.includes('Safari')) browserName = 'Safari';
        uaEl.textContent = \`Browser: \${browserName} (\${navigator.platform || 'Client'})\`;
      }

      if (protocolEl) {
        protocolEl.textContent = window.location.protocol.replace(':', '').toUpperCase();
      }

      async function fetchIP() {
        if (ipTextEl) ipTextEl.innerHTML = '<span class="animate-pulse text-slate-400">Fetching IP...</span>';
        if (refreshIcon) refreshIcon.classList.add('animate-spin');

        try {
          // Primary API
          let res = await fetch('https://api.ipify.org?format=json');
          if (!res.ok) throw new Error('Primary API failed');
          let data = await res.json();
          currentIP = data.ip;

          // Attempt detailed Geo IP lookup from ipapi.co
          try {
            let detailRes = await fetch('https://ipapi.co/json/');
            if (detailRes.ok) {
              let detailData = await detailRes.json();
              if (locationEl) locationEl.textContent = \`\${detailData.city || ''}, \${detailData.country_name || ''}\`.replace(/^, /, '') || 'Detected';
              if (ispEl) ispEl.textContent = detailData.org || detailData.asn || 'Connected Network';
              if (typeEl) typeEl.textContent = detailData.version || (currentIP.includes(':') ? 'IPv6' : 'IPv4');
            }
          } catch (e) {
            if (locationEl) locationEl.textContent = 'Public Client';
            if (ispEl) ispEl.textContent = 'Active Network';
            if (typeEl) typeEl.textContent = currentIP.includes(':') ? 'IPv6' : 'IPv4';
          }

        } catch (err) {
          // Fallback API (ipapi.co directly or ipwho.is)
          try {
            let fallbackRes = await fetch('https://ipwho.is/');
            let fallbackData = await fallbackRes.json();
            if (fallbackData.success) {
              currentIP = fallbackData.ip;
              if (locationEl) locationEl.textContent = \`\${fallbackData.city || ''}, \${fallbackData.country || ''}\`;
              if (ispEl) ispEl.textContent = fallbackData.connection?.isp || fallbackData.connection?.org || 'Network';
              if (typeEl) typeEl.textContent = fallbackData.type || (currentIP.includes(':') ? 'IPv6' : 'IPv4');
            } else {
              throw new Error('Fallback failed');
            }
          } catch (err2) {
            currentIP = '127.0.0.1';
            if (locationEl) locationEl.textContent = 'Local Client';
            if (ispEl) ispEl.textContent = 'Localhost';
            if (typeEl) typeEl.textContent = 'IPv4';
          }
        }

        if (ipTextEl) {
          ipTextEl.textContent = currentIP;
        }

        if (refreshIcon) {
          setTimeout(() => refreshIcon.classList.remove('animate-spin'), 600);
        }
      }

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (!currentIP) return;
          navigator.clipboard.writeText(currentIP).then(() => {
            if (copyLabel) copyLabel.textContent = 'Copied!';
            copyBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            copyBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
            setTimeout(() => {
              if (copyLabel) copyLabel.textContent = 'Copy IP';
              copyBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
              copyBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            }, 2000);
          }).catch(() => {
            alert('IP: ' + currentIP);
          });
        });
      }

      if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchIP);
      }

      fetchIP();
    })();
  </script>
</div>`
  },
  {
    id: 'action-button-placement',
    name: 'Action Button Placement Showcase (Left, Center, Right)',
    category: 'ui',
    icon: 'MoveHorizontal',
    description: 'Interactive Action Button component with live Left, Center, and Right placement switchers & responsive flex alignment',
    html: `<div class="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl font-sans text-slate-900 dark:text-white my-6 apex-action-placement-card relative overflow-hidden">
  <!-- Header -->
  <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
    <div class="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
      <span>⚡ Action Button Component</span>
    </div>
    <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">Flexible Action Button Placement</h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Easily change button alignment to Left, Center, or Right using quick controls or Tailwind classes.</p>
  </div>

  <!-- Interactive Placement Switcher Bar -->
  <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
    <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Select Action Button Placement:</label>
    <div class="grid grid-cols-3 gap-2 text-xs">
      <button type="button" class="btn-align-toggle px-3 py-2 bg-indigo-600 text-white font-semibold rounded-xl border border-indigo-500 shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1" data-align="left">
        <span>⬅ Align Left</span>
      </button>
      <button type="button" class="btn-align-toggle px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-1" data-align="center">
        <span>↔ Center</span>
      </button>
      <button type="button" class="btn-align-toggle px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center justify-center space-x-1" data-align="right">
        <span>Align Right ➡</span>
      </button>
    </div>
  </div>

  <!-- Target Action Button Container Block -->
  <div class="p-6 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl mb-6 shadow-inner">
    <div class="text-[11px] font-mono text-slate-400 dark:text-slate-500 mb-4 flex items-center justify-between">
      <span>Container Viewport</span>
      <span class="active-placement-tag font-bold text-indigo-500">Class: flex justify-start</span>
    </div>

    <!-- The Action Button Container (Switches justify-start / justify-center / justify-end) -->
    <div class="action-btn-container flex justify-start items-center transition-all duration-300">
      <button type="button" class="apex-action-btn px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-95 transition-all flex items-center space-x-2.5 cursor-pointer">
        <span class="text-base">🚀</span>
        <span>Confirm & Proceed</span>
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </button>
    </div>
  </div>

  <!-- Documentation Footer -->
  <div class="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
    <p>💡 <strong>Tailwind Classes for Button Placement:</strong></p>
    <ul class="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300 font-mono">
      <li><strong>Left:</strong> <code class="text-indigo-500">flex justify-start</code> or <code class="text-indigo-500">mr-auto ml-0</code></li>
      <li><strong>Center:</strong> <code class="text-indigo-500">flex justify-center</code> or <code class="text-indigo-500">mx-auto</code></li>
      <li><strong>Right:</strong> <code class="text-indigo-500">flex justify-end</code> or <code class="text-indigo-500">ml-auto mr-0</code></li>
    </ul>
  </div>

  <script>
    (function() {
      const card = document.currentScript ? document.currentScript.closest('.apex-action-placement-card') : document.querySelector('.apex-action-placement-card');
      if (!card) return;

      const container = card.querySelector('.action-btn-container');
      const tag = card.querySelector('.active-placement-tag');
      const btns = card.querySelectorAll('.btn-align-toggle');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const align = btn.dataset.align;
          if (!container) return;

          container.classList.remove('justify-start', 'justify-center', 'justify-end');

          btns.forEach(b => {
            b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
            b.classList.add('bg-slate-200', 'dark:bg-slate-800', 'text-slate-800', 'dark:text-slate-200', 'border-slate-300', 'dark:border-slate-700');
          });

          btn.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-800', 'dark:text-slate-200', 'border-slate-300', 'dark:border-slate-700');
          btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');

          if (align === 'left') {
            container.classList.add('justify-start');
            if (tag) tag.textContent = 'Class: flex justify-start';
          } else if (align === 'center') {
            container.classList.add('justify-center');
            if (tag) tag.textContent = 'Class: flex justify-center';
          } else if (align === 'right') {
            container.classList.add('justify-end');
            if (tag) tag.textContent = 'Class: flex justify-end';
          }
        });
      });
    })();
  </script>
</div>`
  },
  {
    id: '3d-buttons-design-suite',
    name: '3D Action Button Suite (Tactile, Retro, Lift & Glass)',
    category: 'ui',
    icon: 'Timer',
    description: 'Collection of 3D tactile push buttons, retro gaming bevels, neon shadow lift buttons, and glassmorphism 3D buttons with live placement toggles.',
    html: `<div class="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl font-sans text-slate-900 dark:text-white my-6 apex-3d-suite-card relative overflow-hidden">
  <div class="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Header -->
  <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
    <div class="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
      <span>✨ 3D Button Design Suite</span>
    </div>
    <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">Interactive 3D Button Designs</h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Tactile press depth, physical bottom edges, retro gaming bevels, and placement controls.</p>
  </div>

  <!-- Placement & Style Control Panel -->
  <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Action Button Placement:</span>
      <span class="text-[10px] font-mono text-indigo-500 active-3d-placement">Left Aligned</span>
    </div>
    <div class="grid grid-cols-3 gap-2 text-xs">
      <button type="button" class="btn-3d-align px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-xl transition-all cursor-pointer" data-align="start">Left</button>
      <button type="button" class="btn-3d-align px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer" data-align="center">Center</button>
      <button type="button" class="btn-3d-align px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer" data-align="end">Right</button>
    </div>
  </div>

  <!-- 3D Button Showcase Grid -->
  <div class="space-y-6">
    <!-- Style 1: 3D Indigo Tactile Push -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">1. 3D Tactile Push Button</span>
        <span class="text-[10px] font-mono text-indigo-500">border-b-4 active:translate-y-1</span>
      </div>
      <div class="suite-btn-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-2xl border-b-4 border-indigo-950 hover:border-indigo-900 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center space-x-2 cursor-pointer">
          <span>🎮 Press 3D Tactile Button</span>
        </button>
      </div>
    </div>

    <!-- Style 2: 3D Emerald Game Push -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">2. 3D Emerald Game Action Button</span>
        <span class="text-[10px] font-mono text-emerald-500">border-b-4 border-emerald-950</span>
      </div>
      <div class="suite-btn-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center space-x-2 cursor-pointer">
          <span>⚡ Launch Action</span>
        </button>
      </div>
    </div>

    <!-- Style 3: 3D Retro Gaming Arcade Bevel -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">3. Retro 3D Arcade Bevel</span>
        <span class="text-[10px] font-mono text-amber-500">border-b-4 border-r-4 border-slate-950</span>
      </div>
      <div class="suite-btn-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider border-t-2 border-l-2 border-amber-200 border-b-4 border-r-4 border-slate-950 active:border-2 active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-md flex items-center space-x-2 cursor-pointer">
          <span>👾 START GAME 3D</span>
        </button>
      </div>
    </div>

    <!-- Style 4: 3D Shadow Lift Button -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">4. 3D Shadow Lift Button</span>
        <span class="text-[10px] font-mono text-purple-500">shadow-[0_6px_0_0]</span>
      </div>
      <div class="suite-btn-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm rounded-2xl shadow-[0_6px_0_0_rgba(88,28,135,1)] active:shadow-[0_1px_0_0_rgba(88,28,135,1)] active:translate-y-1.5 transition-all flex items-center space-x-2 cursor-pointer">
          <span>📦 Lift Shadow 3D</span>
        </button>
      </div>
    </div>
  </div>

  <script>
    (function() {
      const card = document.currentScript ? document.currentScript.closest('.apex-3d-suite-card') : document.querySelector('.apex-3d-suite-card');
      if (!card) return;

      const wrappers = card.querySelectorAll('.suite-btn-wrapper');
      const alignBtns = card.querySelectorAll('.btn-3d-align');
      const tag = card.querySelector('.active-3d-placement');

      alignBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const align = btn.dataset.align;
          wrappers.forEach(w => {
            w.classList.remove('justify-start', 'justify-center', 'justify-end');
            if (align === 'start') w.classList.add('justify-start');
            else if (align === 'center') w.classList.add('justify-center');
            else if (align === 'end') w.classList.add('justify-end');
          });

          alignBtns.forEach(b => {
            b.classList.remove('bg-indigo-600', 'text-white');
            b.classList.add('bg-slate-200', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
          });
          btn.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
          btn.classList.add('bg-indigo-600', 'text-white');

          if (tag) {
            tag.textContent = align === 'start' ? 'Left Aligned' : align === 'center' ? 'Center Aligned' : 'Right Aligned';
          }
        });
      });
    })();
  </script>
</div>`
  },
  {
    id: '2d-buttons-design-suite',
    name: '2D Action Button Suite (Flat, Outline, Ghost & Neo-Brutalist)',
    category: 'ui',
    icon: 'MoveHorizontal',
    description: 'Modern 2D flat button gallery including Flat Solid, Bordered Outline, Soft Tint/Ghost, Pill Badge, and Neo-Brutalist 2D styles with live placement controls.',
    html: `<div class="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-xl font-sans text-slate-900 dark:text-white my-6 apex-2d-suite-card relative overflow-hidden">
  <div class="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Header -->
  <div class="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
    <div class="inline-flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
      <span>🎨 2D Button Design Suite</span>
    </div>
    <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white">Modern 2D Button Styles</h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Flat solids, crisp outlined borders, subtle ghost tints, rounded pills, and bold neo-brutalist designs.</p>
  </div>

  <!-- Placement & Alignment Switcher -->
  <div class="mb-6 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-xs font-bold text-slate-700 dark:text-slate-300">Action Button Placement:</span>
      <span class="text-[10px] font-mono text-cyan-500 active-2d-placement">Left Aligned</span>
    </div>
    <div class="grid grid-cols-3 gap-2 text-xs">
      <button type="button" class="btn-2d-align px-3 py-1.5 bg-cyan-600 text-white font-semibold rounded-xl transition-all cursor-pointer" data-align="start">Left</button>
      <button type="button" class="btn-2d-align px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-cyan-600 hover:text-white transition-all cursor-pointer" data-align="center">Center</button>
      <button type="button" class="btn-2d-align px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-cyan-600 hover:text-white transition-all cursor-pointer" data-align="end">Right</button>
    </div>
  </div>

  <!-- 2D Button Showcase Grid -->
  <div class="space-y-5">
    <!-- Style 1: 2D Flat Solid -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">1. 2D Flat Solid (Minimalist)</span>
        <span class="text-[10px] font-mono text-cyan-500">bg-indigo-600 shadow-none</span>
      </div>
      <div class="suite-2d-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-none flex items-center space-x-2 cursor-pointer">
          <span>⬛ Primary Flat Action</span>
        </button>
      </div>
    </div>

    <!-- Style 2: 2D Bordered Outline -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">2. 2D Outlined Border</span>
        <span class="text-[10px] font-mono text-indigo-500">border-2 border-indigo-600</span>
      </div>
      <div class="suite-2d-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3 bg-transparent border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold text-sm rounded-xl transition-colors flex items-center space-x-2 cursor-pointer">
          <span>🔲 Secondary Outlined Button</span>
        </button>
      </div>
    </div>

    <!-- Style 3: 2D Soft Ghost Tint -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">3. 2D Soft Tint / Ghost</span>
        <span class="text-[10px] font-mono text-purple-500">bg-purple-50 text-purple-600</span>
      </div>
      <div class="suite-2d-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-medium text-sm rounded-xl transition-colors flex items-center space-x-2 cursor-pointer">
          <span>👻 Soft Ghost Tint Button</span>
        </button>
      </div>
    </div>

    <!-- Style 4: 2D Pill Badge -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">4. 2D Pill Badge Button</span>
        <span class="text-[10px] font-mono text-emerald-500">rounded-full</span>
      </div>
      <div class="suite-2d-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-full transition-colors flex items-center space-x-2 cursor-pointer">
          <span>💊 2D Pill Capsule</span>
        </button>
      </div>
    </div>

    <!-- Style 5: 2D Neo-Brutalist -->
    <div class="p-5 bg-slate-50/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex items-center justify-between mb-3 text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">5. 2D Neo-Brutalist</span>
        <span class="text-[10px] font-mono text-amber-500">border-2 border-black bg-amber-400</span>
      </div>
      <div class="suite-2d-wrapper flex justify-start items-center transition-all duration-300">
        <button type="button" class="px-6 py-3 bg-amber-400 text-slate-900 font-bold text-xs uppercase tracking-wider border-2 border-slate-900 dark:border-white rounded-none hover:bg-amber-300 transition-colors flex items-center space-x-2 cursor-pointer">
          <span>🎨 2D NEO-BRUTALIST</span>
        </button>
      </div>
    </div>
  </div>

  <script>
    (function() {
      const card = document.currentScript ? document.currentScript.closest('.apex-2d-suite-card') : document.querySelector('.apex-2d-suite-card');
      if (!card) return;

      const wrappers = card.querySelectorAll('.suite-2d-wrapper');
      const alignBtns = card.querySelectorAll('.btn-2d-align');
      const tag = card.querySelector('.active-2d-placement');

      alignBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const align = btn.dataset.align;
          wrappers.forEach(w => {
            w.classList.remove('justify-start', 'justify-center', 'justify-end');
            if (align === 'start') w.classList.add('justify-start');
            else if (align === 'center') w.classList.add('justify-center');
            else if (align === 'end') w.classList.add('justify-end');
          });

          alignBtns.forEach(b => {
            b.classList.remove('bg-cyan-600', 'text-white');
            b.classList.add('bg-slate-200', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
          });
          btn.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
          btn.classList.add('bg-cyan-600', 'text-white');

          if (tag) {
            tag.textContent = align === 'start' ? 'Left Aligned' : align === 'center' ? 'Center Aligned' : 'Right Aligned';
          }
        });
      });
    })();
  </script>
</div>`
  },
  {
    id: 'audio-player-studio',
    name: 'Universal Audio Player & Playlist Studio',
    category: 'media',
    icon: 'Music',
    description: 'Full-featured audio player with format support (MP3, WAV, OGG, AAC, FLAC, M4A, WEBM) and playlist importer (M3U, M3U8, PLS, JSON), equalizer presets, frequency spectrum visualizer, embedded cover extraction, and drag-and-drop local audio loader.',
    html: `<div class="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl font-sans text-slate-900 dark:text-white my-6 apex-audio-player-card relative overflow-hidden">
  <!-- Background Glow -->
  <div class="absolute -top-20 -right-20 w-56 h-56 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
  <div class="absolute -bottom-20 -left-20 w-56 h-56 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

  <!-- Header & Format Badges Bar -->
  <div class="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2 relative z-10">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 text-lg">
        🎵
      </div>
      <div>
        <h3 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Universal Audio Studio</span>
          <span class="active-format-badge px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            MP3 / FLAC / WAV / OGG
          </span>
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Supports MP3, WAV, OGG, AAC, FLAC, M4A, WEBM & M3U / PLS / JSON Playlists</p>
      </div>
    </div>

    <!-- Supported Format Pill Tags -->
    <div class="flex items-center space-x-1 text-[10px] font-mono font-semibold">
      <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">M3U</span>
      <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">PLS</span>
      <span class="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">JSON</span>
      <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">ID3 Cover Art</span>
    </div>
  </div>

  <!-- Main Player Display Area (Vinyl / Cover + Track Meta + Visualizer) -->
  <div class="my-6 p-5 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-2xl relative z-10 shadow-inner">
    <div class="flex flex-col sm:flex-row items-center gap-5">
      <!-- Vinyl Disc / Embedded Cover Container -->
      <div class="relative shrink-0 flex flex-col items-center gap-2">
        <div class="cover-wrapper relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
          <div class="vinyl-disc w-full h-full rounded-full bg-slate-900 border-4 border-slate-800 shadow-xl flex items-center justify-center relative overflow-hidden transition-all duration-500">
            <div class="vinyl-overlay absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_rgba(255,255,255,0.08)_31%,_transparent_32%)] pointer-events-none z-10"></div>
            <!-- Album Cover Image -->
            <img class="track-cover-img w-full h-full object-cover rounded-full transition-all duration-300" src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80" alt="Album Cover" />
            <!-- Vinyl Center Hole -->
            <div class="vinyl-hole absolute w-6 h-6 rounded-full bg-slate-950 border-2 border-indigo-500/50 flex items-center justify-center z-20">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
        <!-- Cover Art Style Toggle -->
        <button type="button" class="btn-toggle-cover-style px-2 py-0.5 text-[9px] font-mono font-bold rounded-md bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-xs" title="Toggle Vinyl Disc vs Resized Cover Art Mode">
          🖼️ Resized Artwork
        </button>
      </div>

      <!-- Current Track Details & Spectrum Visualizer -->
      <div class="flex-1 w-full text-center sm:text-left min-w-0">
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="track-artist text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 truncate">Apex Soundscapes</span>
          <span class="track-format-tag text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">OGG</span>
        </div>
        <h4 class="track-title text-xl font-black text-slate-900 dark:text-white truncate">Ambient Synth Horizon</h4>
        <p class="track-album text-xs text-slate-500 dark:text-slate-400 mb-3 truncate">Album: Cybernetic Waves Vol. 1</p>

        <!-- Frequency Spectrum Waveform (16 Bars) -->
        <div class="w-full h-10 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-1.5 flex items-end justify-between gap-1 spectrum-container">
          <span class="spectrum-bar flex-1 bg-indigo-500 rounded-xs h-2 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-indigo-400 rounded-xs h-3 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-purple-500 rounded-xs h-1 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-indigo-500 rounded-xs h-4 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-pink-500 rounded-xs h-2 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-indigo-400 rounded-xs h-5 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-purple-400 rounded-xs h-3 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-indigo-500 rounded-xs h-6 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-cyan-400 rounded-xs h-2 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-indigo-500 rounded-xs h-4 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-purple-500 rounded-xs h-3 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-indigo-400 rounded-xs h-5 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-pink-500 rounded-xs h-2 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-cyan-400 rounded-xs h-4 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-indigo-500 rounded-xs h-3 transition-all duration-75"></span>
          <span class="spectrum-bar flex-1 bg-purple-400 rounded-xs h-1 transition-all duration-75"></span>
        </div>
      </div>
    </div>

    <!-- Seek Bar & Time Displays -->
    <div class="mt-5 space-y-1">
      <div class="relative flex items-center">
        <input type="range" class="audio-seek-bar w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" min="0" max="100" value="0" step="0.1" />
      </div>
      <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-0.5">
        <span class="time-current">00:00</span>
        <span class="time-duration">00:00</span>
      </div>
    </div>
  </div>

  <!-- Primary Controls Toolbar (Prev, Play, Next, Volume, Loop, Shuffle, EQ, Speed) -->
  <div class="space-y-4 relative z-10">
    <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <!-- Main Playback Buttons -->
      <div class="flex items-center space-x-2 mx-auto sm:mx-0">
        <!-- Shuffle Button -->
        <button type="button" class="btn-shuffle p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Toggle Shuffle">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H4m0 0l3-3m-3 3l3 3m13-3h-4m0 0l3-3m-3 3l3 3M4 8h4m0 0l-3-3m3 3L5 5m15 3h-4m0 0l3-3m-3 3l3 3"></path></svg>
        </button>

        <!-- Previous Track Button -->
        <button type="button" class="btn-prev p-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer" title="Previous Track">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>

        <!-- Play / Pause Main Button -->
        <button type="button" class="btn-play-main p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 cursor-pointer flex items-center justify-center">
          <svg class="play-icon w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg class="pause-icon w-6 h-6 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>

        <!-- Next Track Button -->
        <button type="button" class="btn-next p-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer" title="Next Track">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>

        <!-- Loop Mode Button -->
        <button type="button" class="btn-loop p-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer" title="Loop Mode: Off">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </button>
      </div>

      <!-- Volume & Mute Control -->
      <div class="flex items-center space-x-2 mx-auto sm:mx-0 text-xs">
        <button type="button" class="btn-mute text-slate-500 hover:text-indigo-500 dark:text-slate-400 cursor-pointer" title="Mute/Unmute">
          <svg class="vol-icon w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"></path></svg>
        </button>
        <input type="range" class="audio-volume-bar w-20 sm:w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" min="0" max="1" step="0.05" value="0.8" />
      </div>

      <!-- Equalizer & Playback Speed Controls -->
      <div class="flex items-center space-x-2 mx-auto sm:mx-0 text-xs">
        <select class="eq-preset-select px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
          <option value="flat">🎛️ EQ: Flat</option>
          <option value="bass">🔊 Bass Boost</option>
          <option value="treble">✨ Treble Boost</option>
          <option value="vocal">🎙️ Vocal Clarity</option>
          <option value="rock">🎸 Rock / Punch</option>
          <option value="electronic">⚡ Electronic</option>
        </select>

        <select class="playback-speed-select px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1.0" selected>1.0x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2.0">2.0x</option>
        </select>
      </div>
    </div>

    <!-- Playlist Queue Header & Actions -->
    <div class="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div class="flex items-center space-x-2">
          <span class="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>📋 Playlist Queue</span>
            <span class="playlist-count-badge px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-600 text-white font-bold">3 tracks</span>
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <input type="file" class="audio-file-input hidden" accept=".mp3,.wav,.ogg,.aac,.flac,.m4a,.webm,.opus,.m3u,.m3u8,.pls,.json,.csv,.txt" multiple />
          
          <button type="button" class="btn-trigger-upload px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer">
            <span>📂 Open Audio / Playlist</span>
          </button>

          <button type="button" class="btn-export-m3u px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center space-x-1 cursor-pointer" title="Export current playlist to .m3u file">
            <span>💾 Export M3U</span>
          </button>
        </div>
      </div>

      <!-- Drag & Drop Dropzone Box -->
      <div class="playlist-dropzone border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 rounded-xl p-3 text-center transition-colors cursor-pointer mb-3 bg-white/50 dark:bg-slate-900/50">
        <p class="text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span class="text-indigo-500 font-bold">Drag & Drop</span> audio files (<code class="text-indigo-400">.mp3, .wav, .flac, .m4a</code>) or playlists (<code class="text-indigo-400">.m3u, .pls, .json</code>) here
        </p>
      </div>

      <!-- Track Filter / Search Field -->
      <div class="mb-3">
        <input type="text" class="playlist-search-input w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="🔍 Search track or artist in playlist..." />
      </div>

      <!-- Playlist Queue Items List Container -->
      <div class="playlist-items-container max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
        <!-- Rendered dynamically by JS -->
      </div>
    </div>
  </div>

  <!-- Hidden Native Audio Element -->
  <audio class="apex-native-audio" crossorigin="anonymous" preload="metadata"></audio>

  <!-- Embedded JS Engine -->
  <script>
    (function initAudioStudio() {
      const getCard = function() {
        if (document.currentScript && document.currentScript.closest) {
          return document.currentScript.closest('.apex-audio-player-card');
        }
        const cards = document.querySelectorAll('.apex-audio-player-card');
        return cards.length > 0 ? cards[cards.length - 1] : null;
      };

      const card = getCard();
      if (!card) return;
      if (card.dataset.studioInitialized === 'true') return;
      card.dataset.studioInitialized = 'true';

      const audio = card.querySelector('.apex-native-audio');
      if (!audio) return;

      let playlist = [
        {
          id: '1',
          title: 'Ambient Synth Horizon',
          artist: 'Apex Soundscapes',
          album: 'Cybernetic Waves Vol. 1',
          url: 'https://actions.google.com/sounds/v1/science_fiction/space_engine_large.ogg',
          format: 'OGG',
          duration: '01:00',
          cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80'
        },
        {
          id: '2',
          title: 'Chill Lofi Rain Beats',
          artist: 'Lofi Producer',
          album: 'Nighttime Coding Sessions',
          url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
          format: 'OGG',
          duration: '01:00',
          cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
        },
        {
          id: '3',
          title: 'Soft Piano Melodies',
          artist: 'Acoustic Project',
          album: 'Unplugged Resonance',
          url: 'https://actions.google.com/sounds/v1/music/soft_piano.ogg',
          format: 'OGG',
          duration: '01:00',
          cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80'
        }
      ];

      let currentIndex = 0;
      let isPlaying = false;
      let isSeeking = false;
      let loopMode = 0;
      let isShuffle = false;
      let isCoverArtworkMode = false;

      // Web Audio API Nodes
      let audioCtx = null;
      let sourceNode = null;
      let analyserNode = null;
      let bassFilter = null;
      let midFilter = null;
      let trebleFilter = null;
      let animFrameId = null;

      const playBtn = card.querySelector('.btn-play-main');
      const playIcon = card.querySelector('.play-icon');
      const pauseIcon = card.querySelector('.pause-icon');
      const prevBtn = card.querySelector('.btn-prev');
      const nextBtn = card.querySelector('.btn-next');
      const loopBtn = card.querySelector('.btn-loop');
      const shuffleBtn = card.querySelector('.btn-shuffle');
      const seekBar = card.querySelector('.audio-seek-bar');
      const timeCurrent = card.querySelector('.time-current');
      const timeDuration = card.querySelector('.time-duration');
      const volumeBar = card.querySelector('.audio-volume-bar');
      const muteBtn = card.querySelector('.btn-mute');
      const eqSelect = card.querySelector('.eq-preset-select');
      const speedSelect = card.querySelector('.playback-speed-select');
      const vinylDisc = card.querySelector('.vinyl-disc');
      const vinylOverlay = card.querySelector('.vinyl-overlay');
      const vinylHole = card.querySelector('.vinyl-hole');
      const coverImg = card.querySelector('.track-cover-img');
      const toggleCoverBtn = card.querySelector('.btn-toggle-cover-style');
      const titleEl = card.querySelector('.track-title');
      const artistEl = card.querySelector('.track-artist');
      const albumEl = card.querySelector('.track-album');
      const formatTag = card.querySelector('.track-format-tag');
      const playlistContainer = card.querySelector('.playlist-items-container');
      const countBadge = card.querySelector('.playlist-count-badge');
      const searchInput = card.querySelector('.playlist-search-input');
      const fileInput = card.querySelector('.audio-file-input');
      const uploadBtn = card.querySelector('.btn-trigger-upload');
      const exportBtn = card.querySelector('.btn-export-m3u');
      const dropzone = card.querySelector('.playlist-dropzone');
      const bars = card.querySelectorAll('.spectrum-bar');

      function formatTime(sec) {
        if (isNaN(sec) || sec < 0) return '00:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      }

      function detectFormat(urlOrName) {
        if (!urlOrName) return 'AUDIO';
        const ext = urlOrName.split('.').pop().split('?')[0].toLowerCase();
        if (['mp3'].includes(ext)) return 'MP3';
        if (['wav'].includes(ext)) return 'WAV';
        if (['flac'].includes(ext)) return 'FLAC';
        if (['ogg', 'oga'].includes(ext)) return 'OGG';
        if (['m4a', 'aac'].includes(ext)) return 'M4A';
        if (['webm'].includes(ext)) return 'WEBM';
        if (['opus'].includes(ext)) return 'OPUS';
        return 'AUDIO';
      }

      function applyCoverStyle() {
        if (!vinylDisc || !coverImg) return;
        if (isCoverArtworkMode) {
          vinylDisc.className = 'vinyl-disc w-full h-full rounded-2xl border-2 border-indigo-500/40 shadow-xl overflow-hidden transition-all duration-300';
          coverImg.className = 'track-cover-img w-full h-full object-cover rounded-2xl transition-all duration-300';
          if (vinylOverlay) vinylOverlay.style.display = 'none';
          if (vinylHole) vinylHole.style.display = 'none';
          if (toggleCoverBtn) toggleCoverBtn.textContent = '📀 Vinyl Mode';
        } else {
          vinylDisc.className = 'vinyl-disc w-full h-full rounded-full bg-slate-900 border-4 border-slate-800 shadow-xl flex items-center justify-center relative overflow-hidden transition-all duration-500 ' + (isPlaying ? 'animate-spin' : '');
          coverImg.className = 'track-cover-img w-full h-full object-cover rounded-full transition-all duration-300';
          if (vinylOverlay) vinylOverlay.style.display = 'block';
          if (vinylHole) vinylHole.style.display = 'flex';
          if (toggleCoverBtn) toggleCoverBtn.textContent = '🖼️ Resized Artwork';
        }
      }

      if (toggleCoverBtn) {
        toggleCoverBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          isCoverArtworkMode = !isCoverArtworkMode;
          applyCoverStyle();
        });
      }

      // Fast Uint8Array to Base64 String Converter
      function uint8ToBase64(bytes) {
        let binary = '';
        const len = bytes.byteLength;
        const chunkSize = 8192;
        for (let i = 0; i < len; i += chunkSize) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + chunkSize, len)));
        }
        return btoa(binary);
      }

      // FLAC Native METADATA_BLOCK_PICTURE & Vorbis Comment Parser
      function parseFlacCover(buffer, startOffset) {
        const view = new DataView(buffer);
        const start = startOffset || 0;
        if (start + 4 > buffer.byteLength) return null;

        // Check 'fLaC' signature
        if (view.getUint8(start) === 0x66 && view.getUint8(start + 1) === 0x4C && view.getUint8(start + 2) === 0x61 && view.getUint8(start + 3) === 0x43) {
          let offset = start + 4;
          while (offset + 4 <= buffer.byteLength) {
            const header = view.getUint8(offset);
            const isLast = (header & 0x80) !== 0;
            const blockType = header & 0x7F;
            const length = (view.getUint8(offset + 1) << 16) | (view.getUint8(offset + 2) << 8) | view.getUint8(offset + 3);
            offset += 4;

            if (offset + length > buffer.byteLength) break;

            if (blockType === 6) { // METADATA_BLOCK_PICTURE
              try {
                let p = offset;
                const picType = view.getUint32(p, false); p += 4;
                const mimeLen = view.getUint32(p, false); p += 4;
                let mimeType = 'image/jpeg';
                if (mimeLen > 0 && p + mimeLen <= offset + length) {
                  let mStr = '';
                  for (let i = 0; i < mimeLen; i++) mStr += String.fromCharCode(view.getUint8(p + i));
                  if (mStr) mimeType = mStr.trim();
                  p += mimeLen;
                }
                const descLen = view.getUint32(p, false); p += 4;
                p += descLen; // skip description
                p += 16; // skip width (4), height (4), depth (4), colors (4)
                const picLen = view.getUint32(p, false); p += 4;
                if (picLen > 0 && p + picLen <= offset + length) {
                  const picBytes = new Uint8Array(buffer, p, picLen);
                  return 'data:' + mimeType + ';base64,' + uint8ToBase64(picBytes);
                }
              } catch(e) {
                console.warn('FLAC picture block error:', e);
              }
            } else if (blockType === 4) { // VORBIS_COMMENT
              try {
                let p = offset;
                const vendorLen = view.getUint32(p, true); p += 4 + vendorLen;
                if (p + 4 <= offset + length) {
                  const commentListLen = view.getUint32(p, true); p += 4;
                  for (let c = 0; c < commentListLen && p < offset + length; c++) {
                    const commentLen = view.getUint32(p, true); p += 4;
                    if (commentLen > 0 && p + commentLen <= offset + length) {
                      let commentStr = '';
                      const commentBytes = new Uint8Array(buffer, p, commentLen);
                      for (let i = 0; i < commentBytes.length; i++) commentStr += String.fromCharCode(commentBytes[i]);
                      p += commentLen;
                      if (commentStr.toUpperCase().startsWith('METADATA_BLOCK_PICTURE=')) {
                        const b64 = commentStr.substring(commentStr.indexOf('=') + 1).trim();
                        const rawBin = atob(b64);
                        const picBuf = new Uint8Array(rawBin.length);
                        for (let i = 0; i < rawBin.length; i++) picBuf[i] = rawBin.charCodeAt(i);
                        const picView = new DataView(picBuf.buffer);
                        let p2 = 0;
                        const picType = picView.getUint32(p2, false); p2 += 4;
                        const mimeLen = picView.getUint32(p2, false); p2 += 4;
                        let mimeType = 'image/jpeg';
                        let mStr = '';
                        for (let i = 0; i < mimeLen; i++) mStr += String.fromCharCode(picView.getUint8(p2 + i));
                        if (mStr) mimeType = mStr.trim();
                        p2 += mimeLen;
                        const descLen = picView.getUint32(p2, false); p2 += 4; p2 += descLen;
                        p2 += 16;
                        const picLen = picView.getUint32(p2, false); p2 += 4;
                        if (picLen > 0 && p2 + picLen <= picBuf.length) {
                          const imgData = picBuf.subarray(p2, p2 + picLen);
                          return 'data:' + mimeType + ';base64,' + uint8ToBase64(imgData);
                        }
                      }
                    }
                  }
                }
              } catch(e) {
                console.warn('Vorbis comment picture error:', e);
              }
            }

            offset += length;
            if (isLast) break;
          }
        }
        return null;
      }

      // ID3v2 Tag APIC / PIC Frame Parser (MP3 / WAV / FLAC with ID3)
      function parseId3Cover(buffer) {
        const view = new DataView(buffer);
        if (buffer.byteLength < 10) return null;

        if (view.getUint8(0) === 0x49 && view.getUint8(1) === 0x44 && view.getUint8(2) === 0x33) {
          const version = view.getUint8(3);
          const tagSize = ((view.getUint8(6) & 0x7f) << 21) |
                           ((view.getUint8(7) & 0x7f) << 14) |
                           ((view.getUint8(8) & 0x7f) << 7) |
                           (view.getUint8(9) & 0x7f);
          let offset = 10;
          while (offset < tagSize + 10 && offset < buffer.byteLength - 10) {
            let frameId = '';
            let frameSize = 0;
            if (version === 2) {
              frameId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset+1), view.getUint8(offset+2));
              frameSize = (view.getUint8(offset+3) << 16) | (view.getUint8(offset+4) << 8) | view.getUint8(offset+5);
              offset += 6;
            } else {
              frameId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset+1), view.getUint8(offset+2), view.getUint8(offset+3));
              if (version === 4) {
                frameSize = ((view.getUint8(offset+4) & 0x7f) << 21) | ((view.getUint8(offset+5) & 0x7f) << 14) | ((view.getUint8(offset+6) & 0x7f) << 7) | (view.getUint8(offset+7) & 0x7f);
              } else {
                frameSize = view.getUint32(offset+4, false);
              }
              offset += 10;
            }

            if (frameSize <= 0 || offset + frameSize > buffer.byteLength) break;

            if (frameId === 'APIC' || frameId === 'PIC') {
              try {
                const frameStart = offset;
                let mimeType = 'image/jpeg';
                let pos = frameStart;
                const encoding = view.getUint8(pos++);
                if (frameId === 'APIC') {
                  let mimeStr = '';
                  while (pos < frameStart + frameSize && view.getUint8(pos) !== 0) {
                    mimeStr += String.fromCharCode(view.getUint8(pos++));
                  }
                  pos++;
                  if (mimeStr) mimeType = mimeStr.trim();
                } else {
                  const format = String.fromCharCode(view.getUint8(pos), view.getUint8(pos+1), view.getUint8(pos+2));
                  pos += 3;
                  mimeType = format.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';
                }
                pos++; // picture type byte
                if (encoding === 0 || encoding === 3) {
                  while (pos < frameStart + frameSize && view.getUint8(pos) !== 0) pos++;
                  pos++;
                } else if (encoding === 1 || encoding === 2) {
                  while (pos < frameStart + frameSize - 1 && !(view.getUint8(pos) === 0 && view.getUint8(pos+1) === 0)) pos += 2;
                  pos += 2;
                }
                if (pos < frameStart + frameSize) {
                  const imgData = new Uint8Array(buffer, pos, (frameStart + frameSize) - pos);
                  return 'data:' + mimeType + ';base64,' + uint8ToBase64(imgData);
                }
              } catch(e) {
                console.warn('APIC frame parse notice:', e);
              }
            }
            offset += frameSize;
          }

          // Check if FLAC header exists after ID3 tag header
          const flacCoverAfterId3 = parseFlacCover(buffer, 10 + tagSize);
          if (flacCoverAfterId3) return flacCoverAfterId3;
        }
        return null;
      }

      // M4A / MP4 covr atom parser
      function parseM4aCover(buffer) {
        const view = new DataView(buffer);
        let pos = 0;
        while (pos + 8 < buffer.byteLength) {
          const atomSize = view.getUint32(pos, false);
          if (atomSize < 8) break;
          const atomType = String.fromCharCode(view.getUint8(pos+4), view.getUint8(pos+5), view.getUint8(pos+6), view.getUint8(pos+7));
          if (atomType === 'covr') {
            try {
              let dPos = pos + 8;
              while (dPos + 8 < pos + atomSize && dPos + 8 < buffer.byteLength) {
                const dSize = view.getUint32(dPos, false);
                const dType = String.fromCharCode(view.getUint8(dPos+4), view.getUint8(dPos+5), view.getUint8(dPos+6), view.getUint8(dPos+7));
                if (dType === 'data' && dSize > 16) {
                  const flags = view.getUint32(dPos + 8, false);
                  const mimeType = (flags === 14) ? 'image/png' : 'image/jpeg';
                  const imgData = new Uint8Array(buffer, dPos + 16, dSize - 16);
                  return 'data:' + mimeType + ';base64,' + uint8ToBase64(imgData);
                }
                dPos += (dSize >= 8 ? dSize : 8);
              }
            } catch(e) {
              console.warn('M4A covr atom parse notice:', e);
            }
          }
          if (['moov', 'udta', 'meta', 'ilst'].includes(atomType)) {
            pos += (atomType === 'meta' ? 12 : 8);
          } else {
            pos += atomSize;
          }
        }
        return null;
      }

      // Comprehensive Multi-Format Embedded Cover Art Extractor
      function extractEmbeddedCover(file, callback) {
        if (!file) return callback(null);
        const reader = new FileReader();
        reader.onload = function(e) {
          try {
            const buffer = e.target.result;

            // 1. Try FLAC native or Vorbis Comment
            const flacRes = parseFlacCover(buffer, 0);
            if (flacRes) return callback(flacRes);

            // 2. Try ID3v2 (MP3/WAV/FLAC-with-ID3)
            const id3Res = parseId3Cover(buffer);
            if (id3Res) return callback(id3Res);

            // 3. Try M4A / MP4 covr atom
            const m4aRes = parseM4aCover(buffer);
            if (m4aRes) return callback(m4aRes);

          } catch(err) {
            console.warn('Embedded cover extraction notice:', err);
          }
          callback(null);
        };
        // Read up to 16MB of audio file to ensure full embedded image binary data is captured
        reader.readAsArrayBuffer(file.slice(0, Math.min(file.size, 16 * 1024 * 1024)));
      }

      // Initialize Web Audio API & Equalizer Biquad Filters
      function initWebAudio() {
        if (audioCtx) return;
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) return;
          audioCtx = new AudioContextClass();

          bassFilter = audioCtx.createBiquadFilter();
          bassFilter.type = 'lowshelf';
          bassFilter.frequency.value = 320;

          midFilter = audioCtx.createBiquadFilter();
          midFilter.type = 'peaking';
          midFilter.frequency.value = 1000;
          midFilter.Q.value = 0.5;

          trebleFilter = audioCtx.createBiquadFilter();
          trebleFilter.type = 'highshelf';
          trebleFilter.frequency.value = 3200;

          analyserNode = audioCtx.createAnalyser();
          analyserNode.fftSize = 64;

          sourceNode = audioCtx.createMediaElementSource(audio);
          sourceNode.connect(bassFilter);
          bassFilter.connect(midFilter);
          midFilter.connect(trebleFilter);
          trebleFilter.connect(analyserNode);
          analyserNode.connect(audioCtx.destination);

          applyEQPreset(eqSelect ? eqSelect.value : 'flat');
        } catch(e) {
          console.warn('Web Audio initialization notice:', e);
        }
      }

      function applyEQPreset(preset) {
        if (!bassFilter || !midFilter || !trebleFilter) return;
        const presets = {
          flat: { low: 0, mid: 0, high: 0 },
          bass: { low: 9, mid: 0, high: -3 },
          treble: { low: -3, mid: 1, high: 8 },
          vocal: { low: -4, mid: 6, high: 3 },
          rock: { low: 6, mid: -2, high: 5 },
          electronic: { low: 8, mid: 2, high: 6 }
        };
        const settings = presets[preset] || presets.flat;
        bassFilter.gain.value = settings.low;
        midFilter.gain.value = settings.mid;
        trebleFilter.gain.value = settings.high;
      }

      function updateSpectrum() {
        if (analyserNode && isPlaying) {
          const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
          analyserNode.getByteFrequencyData(dataArray);
          const step = Math.floor(dataArray.length / bars.length) || 1;

          bars.forEach((bar, idx) => {
            const val = dataArray[idx * step] || 0;
            const heightPx = Math.max(4, Math.min(36, Math.floor((val / 255) * 36)));
            bar.style.height = heightPx + 'px';
            bar.style.opacity = (0.4 + (val / 255) * 0.6).toFixed(2);
          });
          animFrameId = requestAnimationFrame(updateSpectrum);
        } else if (isPlaying) {
          // Fallback animated rhythm bars when playing
          bars.forEach((bar, idx) => {
            const pseudoVal = Math.floor(Math.random() * 28) + 6;
            bar.style.height = pseudoVal + 'px';
            bar.style.opacity = '0.9';
          });
          animFrameId = requestAnimationFrame(updateSpectrum);
        } else {
          bars.forEach(bar => { bar.style.height = '6px'; bar.style.opacity = '0.4'; });
        }
      }

      function loadTrack(index, autoPlay) {
        if (index < 0 || index >= playlist.length) return;
        currentIndex = index;
        const track = playlist[currentIndex];

        audio.src = track.url;
        if (speedSelect) audio.playbackRate = parseFloat(speedSelect.value);
        if (volumeBar) audio.volume = parseFloat(volumeBar.value);

        if (titleEl) titleEl.textContent = track.title;
        if (artistEl) artistEl.textContent = track.artist || 'Unknown Artist';
        if (albumEl) albumEl.textContent = track.album ? 'Album: ' + track.album : 'Single Track';
        if (coverImg && track.cover) coverImg.src = track.cover;
        if (formatTag) formatTag.textContent = track.format || detectFormat(track.url);

        if (track.hasEmbeddedCover) {
          isCoverArtworkMode = true;
        }
        applyCoverStyle();
        renderPlaylist();

        if (autoPlay) {
          playAudio();
        } else {
          pauseAudio();
        }
      }

      function playAudio() {
        initWebAudio();
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        if (speedSelect) {
          audio.playbackRate = parseFloat(speedSelect.value);
        }

        audio.play().then(function() {
          isPlaying = true;
          if (playIcon) playIcon.classList.add('hidden');
          if (pauseIcon) pauseIcon.classList.remove('hidden');
          applyCoverStyle();
          updateSpectrum();
        }).catch(function(err) {
          console.warn('Playback error or gesture needed:', err);
          isPlaying = false;
        });
      }

      function pauseAudio() {
        audio.pause();
        isPlaying = false;
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
        applyCoverStyle();
        if (animFrameId) cancelAnimationFrame(animFrameId);
        updateSpectrum();
      }

      function togglePlay() {
        if (isPlaying) {
          pauseAudio();
        } else {
          playAudio();
        }
      }

      function renderPlaylist(filterText) {
        if (!playlistContainer) return;
        playlistContainer.innerHTML = '';

        const term = (filterText || '').toLowerCase();
        const filtered = playlist.filter(function(t) {
          return t.title.toLowerCase().includes(term) || (t.artist && t.artist.toLowerCase().includes(term));
        });

        // Always update exact track count badge dynamically
        if (countBadge) {
          countBadge.textContent = playlist.length + (playlist.length === 1 ? ' track' : ' tracks');
        }

        filtered.forEach(function(track) {
          const originalIdx = playlist.findIndex(function(p) { return p.id === track.id; });
          const isCurrent = originalIdx === currentIndex;

          const item = document.createElement('div');
          item.className = 'p-2.5 rounded-xl flex items-center justify-between gap-3 border transition-all cursor-pointer ' +
            (isCurrent
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md font-semibold'
              : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200');

          item.innerHTML = 
            '<div class="flex items-center space-x-2.5 min-w-0 flex-1">' +
              '<span class="w-5 text-center text-[10px] font-mono ' + (isCurrent ? 'text-white font-bold' : 'text-slate-400') + '">' + (isCurrent ? '▶' : originalIdx + 1) + '</span>' +
              '<div class="min-w-0 flex-1">' +
                '<div class="truncate text-xs ' + (isCurrent ? 'text-white font-bold' : 'font-medium') + '">' + track.title + '</div>' +
                '<div class="truncate text-[10px] ' + (isCurrent ? 'text-indigo-100' : 'text-slate-400') + '">' + (track.artist || 'Unknown') + '</div>' +
              '</div>' +
            '</div>' +
            '<div class="flex items-center space-x-2 shrink-0 text-[10px] font-mono">' +
              '<span class="px-1.5 py-0.5 rounded ' + (isCurrent ? 'bg-indigo-800/60 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400') + '">' + (track.format || detectFormat(track.url)) + '</span>' +
              '<button type="button" class="btn-remove-track p-1 hover:text-rose-400 transition-colors cursor-pointer" title="Remove track">✕</button>' +
            '</div>';

          item.addEventListener('click', function(e) {
            if (e.target.closest('.btn-remove-track')) return;
            loadTrack(originalIdx, true);
          });

          const removeBtn = item.querySelector('.btn-remove-track');
          if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              playlist.splice(originalIdx, 1);
              if (playlist.length === 0) {
                audio.src = '';
                if (titleEl) titleEl.textContent = 'No tracks in playlist';
                if (artistEl) artistEl.textContent = '-';
                pauseAudio();
                renderPlaylist(filterText);
              } else if (currentIndex >= playlist.length) {
                loadTrack(0, false);
              } else if (originalIdx === currentIndex) {
                loadTrack(currentIndex, false);
              } else {
                renderPlaylist(filterText);
              }
            });
          }

          playlistContainer.appendChild(item);
        });
      }

      function parsePlaylistContent(content, filename) {
        const newTracks = [];
        const ext = (filename || '').split('.').pop().toLowerCase();

        if (ext === 'json' || content.trim().startsWith('[') || content.trim().startsWith('{')) {
          try {
            const data = JSON.parse(content);
            const list = Array.isArray(data) ? data : (data.playlist || data.tracks || []);
            list.forEach(function(item, idx) {
              if (item.url || item.src) {
                newTracks.push({
                  id: 'pl-' + Date.now() + '-' + idx,
                  title: item.title || ('Track ' + (idx + 1)),
                  artist: item.artist || 'Unknown Artist',
                  album: item.album || 'JSON Playlist',
                  url: item.url || item.src,
                  format: detectFormat(item.url || item.src),
                  cover: item.cover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80'
                });
              }
            });
          } catch(e) { console.error('Invalid JSON playlist format', e); }
        } else if (ext === 'pls' || content.includes('[playlist]')) {
          const lines = content.split('\\n');
          const entries = {};
          lines.forEach(function(line) {
            const parts = line.split('=');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const val = parts.slice(1).join('=').trim();
              if (key.startsWith('File')) {
                const num = key.replace('File', '');
                entries[num] = entries[num] || {};
                entries[num].url = val;
              } else if (key.startsWith('Title')) {
                const num = key.replace('Title', '');
                entries[num] = entries[num] || {};
                entries[num].title = val;
              }
            }
          });
          Object.keys(entries).forEach(function(num) {
            if (entries[num].url) {
              newTracks.push({
                id: 'pls-' + Date.now() + '-' + num,
                title: entries[num].title || ('PLS Track ' + num),
                artist: 'PLS Stream',
                url: entries[num].url,
                format: detectFormat(entries[num].url),
                cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80'
              });
            }
          });
        } else { // M3U / M3U8
          const lines = content.split('\\n');
          let currentTitle = '';
          let currentArtist = '';

          lines.forEach(function(line, idx) {
            const trimmed = line.trim();
            if (!trimmed) return;
            if (trimmed.startsWith('#EXTINF:')) {
              const info = trimmed.replace('#EXTINF:', '');
              const commaIdx = info.indexOf(',');
              if (commaIdx !== -1) {
                const meta = info.substring(commaIdx + 1);
                if (meta.includes('-')) {
                  const parts = meta.split('-');
                  currentArtist = parts[0].trim();
                  currentTitle = parts.slice(1).join('-').trim();
                } else {
                  currentTitle = meta.trim();
                }
              }
            } else if (!trimmed.startsWith('#')) {
              newTracks.push({
                id: 'm3u-' + Date.now() + '-' + idx,
                title: currentTitle || ('M3U Track ' + (idx + 1)),
                artist: currentArtist || 'M3U Playlist',
                url: trimmed,
                format: detectFormat(trimmed),
                cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80'
              });
              currentTitle = '';
              currentArtist = '';
            }
          });
        }

        if (newTracks.length > 0) {
          playlist = playlist.concat(newTracks);
          renderPlaylist();
        }
      }

      function handleFiles(files) {
        const audioFiles = [];
        const fileList = Array.from(files);

        fileList.forEach(function(file) {
          const ext = file.name.split('.').pop().toLowerCase();
          if (['m3u', 'm3u8', 'pls', 'json', 'csv', 'txt'].includes(ext)) {
            const reader = new FileReader();
            reader.onload = function(e) { parsePlaylistContent(e.target.result, file.name); };
            reader.readAsText(file);
          } else {
            const blobUrl = URL.createObjectURL(file);
            const trackObj = {
              id: 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
              title: file.name.replace(/\.[^/.]+$/, ""),
              artist: 'Local Track',
              album: 'Local Import',
              url: blobUrl,
              format: detectFormat(file.name),
              cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
              hasEmbeddedCover: false
            };

            // Attempt to extract embedded ID3 cover art graphic from local audio file
            extractEmbeddedCover(file, function(coverDataUri) {
              if (coverDataUri) {
                trackObj.cover = coverDataUri;
                trackObj.hasEmbeddedCover = true;
                if (playlist[currentIndex] && playlist[currentIndex].id === trackObj.id) {
                  if (coverImg) coverImg.src = coverDataUri;
                  isCoverArtworkMode = true;
                  applyCoverStyle();
                }
                renderPlaylist();
              }
            });

            audioFiles.push(trackObj);
          }
        });

        if (audioFiles.length > 0) {
          playlist = playlist.concat(audioFiles);
          // Update playlist queue & count badge cleanly without auto-playing or new tabs
          renderPlaylist();
        }
      }

      function exportPlaylistM3U() {
        let m3u = '#EXTM3U\\n';
        playlist.forEach(function(track) {
          m3u += '#EXTINF:-1,' + (track.artist || 'Artist') + ' - ' + track.title + '\\n' + track.url + '\\n';
        });
        const blob = new Blob([m3u], { type: 'audio/x-mpegurl' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'playlist.m3u';
        a.click();
        setTimeout(function() { URL.revokeObjectURL(url); }, 2000);
      }

      // Memoized Controls Controller to encapsulate playback logic and prevent unintended re-renders / navigation
      const memoizedControls = (function() {
        return {
          play: function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            togglePlay();
          },
          next: function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            if (playlist.length === 0) return;
            if (isShuffle) {
              const rand = Math.floor(Math.random() * playlist.length);
              loadTrack(rand, true);
            } else {
              const nextIdx = (currentIndex + 1) % playlist.length;
              loadTrack(nextIdx, true);
            }
          },
          prev: function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            if (playlist.length === 0) return;
            const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
            loadTrack(prevIdx, true);
          },
          loop: function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            loopMode = (loopMode + 1) % 3;
            if (loopBtn) {
              loopBtn.className = 'btn-loop p-2 rounded-xl transition-colors cursor-pointer ' +
                (loopMode > 0 ? 'text-indigo-500 font-bold bg-indigo-500/10' : 'text-slate-400');
              loopBtn.title = loopMode === 1 ? 'Loop Playlist' : loopMode === 2 ? 'Loop Track' : 'Loop Off';
            }
          },
          shuffle: function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            isShuffle = !isShuffle;
            if (shuffleBtn) {
              shuffleBtn.className = 'btn-shuffle p-2 rounded-xl transition-colors cursor-pointer ' +
                (isShuffle ? 'text-indigo-500 font-bold bg-indigo-500/10' : 'text-slate-400');
            }
          },
          mute: function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            audio.muted = !audio.muted;
            if (volumeBar && audio.muted) volumeBar.value = 0;
            else if (volumeBar) volumeBar.value = audio.volume || 0.8;
            if (muteBtn) muteBtn.classList.toggle('text-rose-500', audio.muted);
          },
          toggleCoverStyle: function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            isCoverArtworkMode = !isCoverArtworkMode;
            applyCoverStyle();
          }
        };
      })();

      // Control Event Listeners using Memoized Controls Controller
      if (playBtn) playBtn.addEventListener('click', memoizedControls.play);
      if (nextBtn) nextBtn.addEventListener('click', memoizedControls.next);
      if (prevBtn) prevBtn.addEventListener('click', memoizedControls.prev);
      if (loopBtn) loopBtn.addEventListener('click', memoizedControls.loop);
      if (shuffleBtn) shuffleBtn.addEventListener('click', memoizedControls.shuffle);
      if (muteBtn) muteBtn.addEventListener('click', memoizedControls.mute);
      if (toggleCoverBtn) toggleCoverBtn.addEventListener('click', memoizedControls.toggleCoverStyle);

      // Audio position & duration updates
      audio.addEventListener('timeupdate', function() {
        if (!isSeeking && !isNaN(audio.duration) && audio.duration > 0) {
          const pct = (audio.currentTime / audio.duration) * 100;
          if (seekBar) seekBar.value = pct;
          if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
          if (timeDuration) timeDuration.textContent = formatTime(audio.duration);
        }
      });

      audio.addEventListener('loadedmetadata', function() {
        if (timeDuration) timeDuration.textContent = formatTime(audio.duration);
        if (speedSelect) audio.playbackRate = parseFloat(speedSelect.value);
      });

      audio.addEventListener('ended', function() {
        if (loopMode === 2) {
          audio.currentTime = 0;
          playAudio();
        } else if (loopMode === 1 || currentIndex < playlist.length - 1) {
          const nextIdx = (currentIndex + 1) % playlist.length;
          loadTrack(nextIdx, true);
        } else {
          pauseAudio();
        }
      });

      // Interactive Seekbar Event Listeners
      if (seekBar) {
        seekBar.addEventListener('mousedown', function() { isSeeking = true; });
        seekBar.addEventListener('touchstart', function() { isSeeking = true; });

        seekBar.addEventListener('input', function() {
          if (!isNaN(audio.duration) && audio.duration > 0) {
            const targetTime = (parseFloat(seekBar.value) / 100) * audio.duration;
            if (timeCurrent) timeCurrent.textContent = formatTime(targetTime);
          }
        });

        seekBar.addEventListener('change', function() {
          if (!isNaN(audio.duration) && audio.duration > 0) {
            audio.currentTime = (parseFloat(seekBar.value) / 100) * audio.duration;
          }
          isSeeking = false;
        });
      }

      // Volume slider listeners (input + change)
      if (volumeBar) {
        const updateVol = function() {
          const v = parseFloat(volumeBar.value);
          audio.volume = v;
          audio.muted = (v === 0);
          if (muteBtn) muteBtn.classList.toggle('text-rose-500', v === 0);
        };
        volumeBar.addEventListener('input', updateVol);
        volumeBar.addEventListener('change', updateVol);
      }

      if (muteBtn) {
        muteBtn.addEventListener('click', function() {
          audio.muted = !audio.muted;
          if (volumeBar && audio.muted) volumeBar.value = 0;
          else if (volumeBar) volumeBar.value = audio.volume || 0.8;
          muteBtn.classList.toggle('text-rose-500', audio.muted);
        });
      }

      if (eqSelect) {
        eqSelect.addEventListener('change', function() {
          applyEQPreset(eqSelect.value);
        });
      }

      if (speedSelect) {
        speedSelect.addEventListener('change', function() {
          audio.playbackRate = parseFloat(speedSelect.value);
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', function() {
          renderPlaylist(searchInput.value);
        });
      }

      if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          fileInput.click();
        });
        fileInput.addEventListener('change', function(e) {
          e.stopPropagation();
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
            fileInput.value = ''; // Reset input selection
          }
        });
      }

      if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          exportPlaylistM3U();
        });
      }

      if (dropzone) {
        dropzone.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (fileInput) fileInput.click();
        });
        dropzone.addEventListener('dragover', function(e) {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('border-indigo-500', 'bg-indigo-50/50');
        });
        dropzone.addEventListener('dragleave', function(e) {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('border-indigo-500', 'bg-indigo-50/50');
        });
        dropzone.addEventListener('drop', function(e) {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('border-indigo-500', 'bg-indigo-50/50');
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        });
      }

      // Initial track load
      loadTrack(0, false);
    })();
  </script>
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

  <!-- RIGHT-TO-LEFT SCROLLING MARQUEE BANNER -->
  <div class="w-full bg-slate-900 text-slate-100 py-3 border-y border-slate-800 overflow-hidden relative font-sans">
    <div class="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
    <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
    <style>
      @keyframes defaultMarqueeRTL {
        0% { transform: translate3d(0, 0, 0); }
        100% { transform: translate3d(-50%, 0, 0); }
      }
      .default-marquee-track {
        display: flex;
        width: max-content;
        animation: defaultMarqueeRTL 24s linear infinite;
      }
      .default-marquee-track:hover {
        animation-play-state: paused;
      }
    </style>
    <div class="default-marquee-track flex items-center space-x-8 text-xs font-medium">
      <div class="flex items-center space-x-8 shrink-0">
        <span class="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-0.5 rounded-full border border-indigo-500/30 text-xs font-semibold">
          <span class="animate-pulse">⚡</span>
          <span>ANNOUNCEMENT</span>
        </span>
        <span class="text-slate-200">🚀 ApexStudio 2.0 Released — Drag & Drop Visual Web Builder</span>
        <span class="text-indigo-400 font-bold">✦</span>
        <span class="text-slate-300">🖼️ Image Formats: JXL, JPEG 2000, WebP, SVG, AVIF, PNG, JPG</span>
        <span class="text-purple-400 font-bold">✦</span>
        <span class="text-slate-200">📊 Live Vector Draw.io Flowcharts</span>
        <span class="text-emerald-400 font-bold">✦</span>
        <span class="text-slate-300">🌐 Direct 1-Click Multi-Cloud Deployment</span>
        <span class="text-amber-400 font-bold">✦</span>
      </div>
      <div class="flex items-center space-x-8 shrink-0" aria-hidden="true">
        <span class="inline-flex items-center space-x-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-0.5 rounded-full border border-indigo-500/30 text-xs font-semibold">
          <span class="animate-pulse">⚡</span>
          <span>ANNOUNCEMENT</span>
        </span>
        <span class="text-slate-200">🚀 ApexStudio 2.0 Released — Drag & Drop Visual Web Builder</span>
        <span class="text-indigo-400 font-bold">✦</span>
        <span class="text-slate-300">🖼️ Image Formats: JXL, JPEG 2000, WebP, SVG, AVIF, PNG, JPG</span>
        <span class="text-purple-400 font-bold">✦</span>
        <span class="text-slate-200">📊 Live Vector Draw.io Flowcharts</span>
        <span class="text-emerald-400 font-bold">✦</span>
        <span class="text-slate-300">🌐 Direct 1-Click Multi-Cloud Deployment</span>
        <span class="text-amber-400 font-bold">✦</span>
      </div>
    </div>
  </div>

  <!-- HERO SECTION -->
  <section class="py-16 px-6 max-w-6xl mx-auto text-center">
    <span class="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
      ⚡ WYSIWYG & MULTI-CLOUD DEPLOYMENT
    </span>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Visual Web Editor & Cloud Archiver</span>
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
