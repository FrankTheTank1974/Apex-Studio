# ApexStudio - WYSIWYG HTML IDE, Real-Time Collaboration & Cloud Deployment Platform

**ApexStudio** is a full-featured visual web application builder and cloud deployment IDE. It combines a live visual drag-and-drop WYSIWYG canvas, raw HTML/CSS/JS code editors, embedded Draw.io architecture diagramming, WebSocket real-time team collaboration, multi-VCS repository & hosting deployment (GitHub, GitLab, Bitbucket, Codeberg, Apache SVN, CVS, Mercurial Hg, Vercel, Netlify), and native `.tar.zst` binary archival.

---

## 🌟 Key Features

### 1. 🎨 Visual WYSIWYG Canvas & Drag-and-Drop Palette
- **Live Visual Editing**: Click any element directly on the rendering stage to modify text, styles, and attributes.
- **Drag-and-Drop Components**: Pre-built, responsive Tailwind CSS components (SaaS heroes, navbars, 3-column feature grids, contact forms, pricing tables, media cards).
- **Inspector Panel**: Easily adjust typography, background colors, padding, borders, HTML attributes (`id`, `href`, `src`, `alt`), duplicate, or re-order DOM nodes.
- **Responsive Viewports**: Seamlessly toggle between Desktop (100%), Tablet (768px), and Mobile (375px) device preview frames.

### 2. ⚡ Real-Time Code Sync, Multi-File Editor, Groovy & XML Runtimes
- **Multi-File Tab Bar**: Edit raw `index.html`, `styles.css`, `script.js`, `GroovyScript (.groovy)`, and `XML (.xml)`, or create custom files on the fly.
- **GroovyScript Syntax Highlighting & Execution Engine**: Dedicated Groovy syntax highlighter for annotations (`@CompileStatic`), keywords (`def`, `trait`, `as`), GStrings, and Groovy operators with an in-browser execution runner (`runGroovyScript`).
- **Real-Time Groovy Linter**: Detects unclosed quotes/brackets, Java-style `System.out.println` anti-patterns, redundant `def` keywords with explicit types, malformed Elvis operators `?:`, conditional assignments `if (a = b)`, and unnecessary semicolons with automated quick fixes.
- **XML Syntax Highlighting, Structure Explorer, XSD Validation, Breadcrumbs, Auto-Completion & Linter Engine**: Highlights XML processing instructions (`<?xml ?>`), namespaces (`xmlns:xs`), CDATA blocks (`<![CDATA[ ]]>`), DOCTYPE declarations, and tags with strict case-sensitive well-formedness validation. Features an interactive **XML Structure Explorer** side panel with collapsible node tree view, tag/attribute search filter, expand/collapse toggles, and 1-click jump-to-node editor targeting; W3C **XSD Schema Validation Engine** with live schema error highlighting; interactive **XML Breadcrumb Navigation Bar** showing active tag hierarchy for cursor position; intelligent **XML Tag Auto-Completion** derived from document structure with auto-close detection; quick-pill structure bar; keyboard navigation (`Ctrl+Space`); 1-click **Format XML** auto-indentation pretty-printing; and instant **Convert XML to JSON** export pipeline.
- **SQL Database Studio Component**: Access and query common SQL databases including **PostgreSQL**, **MySQL**, **MariaDB**, and **SQLite**. Features schema table inspection, primary/foreign key field detection, interactive data grid with sorting and multi-field filtering, automated **Data Visualizer** (recharts bar/pie/line charts for numeric and categorical distributions), **SQL Snippets Library** (15+ 1-click templates for JOINs, HAVING aggregations, CASE WHEN formatting, ROW_NUMBER/RANK/SUM window functions, CTEs, and DDL/Upsert schemas), real-time **SQL Syntax Error Highlighter & Linter** (instant detection of unclosed quotes, unmatched parentheses, missing FROM clauses, dangling keywords, trailing commas, non-existent schema tables, & missing semicolons with 1-click automated quick fixes), syntax-aware **SQL Auto-Completion Engine** (real-time keyword & active database schema table/column suggestions with keyboard navigation, `Ctrl+Space` manual trigger, and quick-schema insertion pills), interactive **Visual Schema Designer** (create and edit tables visually with custom field types, primary/foreign key references, nullable flags, defaults, and live DDL SQL generation for PostgreSQL, MySQL, SQLite, & MariaDB with 1-click query runner injection), custom database connection test manager, and 1-click **Export to CSV / Export SQL Schema to Project**.
- **Split & Full View Modes**: Switch between **Visual Canvas**, **Split View**, **Code Editor**, and **Live Preview**.
- **Instant Code Reflection**: Changes in code immediately re-render on the visual canvas, and visual canvas edits synchronize back to source files.

### 3. ❖ Embedded Draw.io Architecture Integration
- **Flowchart & Vector Diagramming**: Seamlessly launch an embedded Draw.io editor inside the IDE.
- **Direct Canvas Insertion**: Save system flowcharts and architecture diagrams as vector SVGs directly into your HTML page.
- **Re-editable Diagrams**: Double-click diagram containers on the visual canvas to re-open and update them in Draw.io anytime.

### 4. 🚀 Multi-Cloud & Multi-VCS Deployment Engine
- **Source Control & VCS Integrations**: Direct push pipeline for **GitHub**, **GitLab**, **Bitbucket**, **Codeberg**, **Apache SVN** (Subversion), **CVS** (Concurrent Versions System), and **Mercurial (Hg)**.
- **Edge Hosting Providers**: Instant single-click publishing to **Vercel** and **Netlify**.
- **Configurable Environments**: Supports custom repository/module names, target branches/trunks (`main`, `trunk`, `HEAD`, `default`), access token/credentials authentication, and public/private flags.

### 5. 👥 Real-Time Team Collaboration
- **WebSocket Room Engine**: Create or join collaboration rooms with shared room codes.
- **Live Presence & Cursors**: See team members working on the project simultaneously with colored cursors.
- **Team Chat**: Integrated side-drawer chat for real-time team communication.

### 6. 📦 Native `.tar.zst` Local Archival
- **POSIX USTAR + Zstandard Compression**: Export complete projects into high-ratio compressed `.tar.zst` archives.
- **Offline Archiving**: Download raw or compressed archives directly in browser or generate via server API (`/api/export/zst`).

### 7. 🤖 Gemini 3.6 Flash AI Copilot
- **Server-side Proxy (`/api/ai/generate`)**: Prompt Gemini 3.6 Flash to generate custom Tailwind HTML components, layout blocks, or full pages and insert them directly onto the canvas.

### 8. 🛡️ WCAG 2.1 AA Accessibility Auditor
- **Automated Compliance Engine**: Analyzes HTML structure, heading hierarchy, image `alt` attributes, color contrast ratios, form labels, and landmark regions.
- **One-Click Quick Fixes**: Automatically repair missing labels, heading skips, low contrast pairs, and invalid attributes.

### 9. 🖼️ Image Optimization Studio
- **Client-Side Compression & Conversion**: Convert images to high-efficiency WebP format, adjust dimensions, tune quality, and apply focal point crops directly before inserting into your projects.

### 10. 🎨 Animation, Shadow & Visual Style Designer
- **Keyframe & Transition Builder**: Generate pure Tailwind CSS entry, hover, pulse, and custom keyframe animations.
- **Shadow & Border Controls**: Intuitively adjust box shadows, colored glows, outline borders, and corner radii with instant CSS output.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend / Server**: Node.js, Express, `ws` (WebSockets), `zstd-codec`
- **AI Engine**: `@google/genai` (Gemini 3.6 Flash)
- **Diagramming**: Draw.io Embed Protocol (`embed.diagrams.net`)

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Mode
Run the Express + Vite server locally:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build & Production Start
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── server.ts                    # Express server with WebSockets & Gemini API proxy
├── src/
│   ├── App.tsx                  # Main IDE layout & state orchestrator
│   ├── components/
│   │   ├── Navbar.tsx           # IDE header, view modes, and device frame triggers
│   │   ├── ComponentLibrary.tsx # Drag-and-drop component palette
│   │   ├── WYSIWYGCanvas.tsx    # Interactive rendering stage & drag drop target
│   │   ├── InspectorPanel.tsx   # Live DOM & Tailwind CSS style inspector
│   │   ├── A11yAuditorPanel.tsx # WCAG 2.1 AA accessibility auditing & auto-fixes
│   │   ├── ImageOptimizerModal.tsx # WebP image optimization & cropping studio
│   │   ├── AnimationBuilder.tsx # Custom Tailwind CSS animation & keyframe generator
│   │   ├── ShadowBorderControlPanel.tsx # Visual shadow, border & glow studio
│   │   ├── VersionHistoryPanel.tsx # Granular revision history timeline
│   │   ├── CodeEditor.tsx       # Raw multi-file code editor with syntax tabs
│   │   ├── XsdValidationModal.tsx # W3C XSD Schema validation modal dialog
│   │   ├── DrawIoEditor.tsx     # Embedded Draw.io iframe modal
│   │   ├── CollaborationBar.tsx # Real-time WebSocket room & chat drawer
│   │   ├── ExportDeployModal.tsx# Cloud release & .tar.zst export hub
│   │   └── AIAssistantModal.tsx # Gemini AI component copilot modal
│   ├── data/
│   │   └── componentsData.ts    # Pre-built component templates & starter files
│   ├── utils/
│   │   ├── xsdValidator.ts      # W3C XML Schema (XSD) parser & validation engine
│   │   ├── xmlToJson.ts         # XML markup parser & structured JSON conversion engine
│   │   ├── xmlAutoCompleter.ts  # XML tag auto-completer & structure suggestion engine
│   │   ├── xmlFormatter.ts      # XML auto-indentation pretty-printing utility
│   │   ├── xmlLinter.ts         # Real-time XML linter & well-formedness quick-fix engine
│   │   ├── groovyLinter.ts      # Real-time GroovyScript linter & quick-fix engine
│   │   ├── groovyEngine.ts      # GroovyScript transpiler & execution runtime
│   │   ├── syntaxHighlighter.ts # Multilanguage HTML, CSS, JS, TS, Groovy & XML syntax highlighter
│   │   ├── a11yAuditor.ts       # WCAG 2.1 AA rule checker & quick-fix engine
│   │   ├── imageOptimizer.ts    # Client-side WebP canvas compressor & cropper
│   │   ├── animationPresets.ts  # Tailwind CSS animation presets & keyframes
│   │   └── tarZstd.ts           # POSIX TAR & Zstandard compression binary exporter
│   └── types.ts                 # Global TypeScript definitions
└── metadata.json                # Application permissions & capabilities
```

---

## 🔒 Environment Variables

Define the following in your `.env` file (or configure in AI Studio Secrets):

```env
# Required for AI Copilot component generation
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Self-referential Cloud Run service URL
APP_URL="YOUR_APP_URL"
```

---

## 📄 License
MIT License. Built for seamless web creation and rapid cloud deployment.
