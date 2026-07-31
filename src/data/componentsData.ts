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
