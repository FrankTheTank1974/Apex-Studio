# ApexStudio - WYSIWYG HTML IDE, Real-Time Collaboration & Cloud Deployment Platform

**ApexStudio** is a full-featured visual web application builder and cloud deployment IDE. It combines a live visual drag-and-drop WYSIWYG canvas, raw HTML/CSS/JS code editors, embedded Draw.io architecture diagramming, WebSocket real-time team collaboration, multi-VCS repository & hosting deployment (GitHub, GitLab, Bitbucket, Codeberg, Apache SVN, CVS, Mercurial Hg, Vercel, Netlify), and native `.tar.zst` binary archival.

---

## 🌟 Key Features

### 1. 🎨 Visual WYSIWYG Canvas & Drag-and-Drop Palette
- **Live Visual Editing**: Click any element directly on the rendering stage to modify text, styles, and attributes.
- **Drag-and-Drop Components**: Pre-built, responsive Tailwind CSS components (SaaS heroes, navbars, 3-column feature grids, contact forms, pricing tables, media cards).
- **Inspector Panel**: Easily adjust typography, background colors, padding, borders, HTML attributes (`id`, `href`, `src`, `alt`), duplicate, or re-order DOM nodes.
- **Responsive Viewports**: Seamlessly toggle between Desktop (100%), Tablet (768px), and Mobile (375px) device preview frames.

### 2. ⚡ Real-Time Code Sync & Multi-File Editor
- **Multi-File Tab Bar**: Edit raw `index.html`, `styles.css`, and `script.js`, or create custom files on the fly.
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

### 7. 🤖 Gemini 2.5 Flash AI Copilot
- **Server-side Proxy (`/api/ai/generate`)**: Prompt Gemini to generate custom Tailwind HTML components or full sections and insert them directly onto the canvas.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend / Server**: Node.js, Express, `ws` (WebSockets), `zstd-codec`
- **AI Engine**: `@google/genai` (Gemini 2.5 Flash)
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
│   │   ├── CodeEditor.tsx       # Raw multi-file code editor with syntax tabs
│   │   ├── DrawIoEditor.tsx     # Embedded Draw.io iframe modal
│   │   ├── CollaborationBar.tsx # Real-time WebSocket room & chat drawer
│   │   ├── ExportDeployModal.tsx# Cloud release & .tar.zst export hub
│   │   └── AIAssistantModal.tsx # Gemini AI component copilot modal
│   ├── data/
│   │   └── componentsData.ts    # Pre-built component templates & starter files
│   ├── utils/
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
