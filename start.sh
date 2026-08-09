#!/usr/bin/env bash
# ==============================================================================
# Application Build, Start & Browser Launch Helper Script (ApexStudio)
# ==============================================================================

set -e

PORT=${PORT:-3000}
URL="http://localhost:${PORT}"

echo "🚀 Starting ApexStudio setup..."

# 1. Check for updates on GitHub
check_github_updates() {
  if command -v git >/dev/null 2>&1 && [ -d ".git" ]; then
    echo "🔍 Checking for updates on GitHub..."
    
    # Attempt git fetch gracefully
    if git fetch origin --quiet 2>/dev/null; then
      LOCAL_HASH=$(git rev-parse HEAD 2>/dev/null || echo "")
      REMOTE_HASH=$(git rev-parse '@{u}' 2>/dev/null || echo "")
      
      if [ -n "$LOCAL_HASH" ] && [ -n "$REMOTE_HASH" ] && [ "$LOCAL_HASH" != "$REMOTE_HASH" ]; then
        echo "🔄 New updates detected on GitHub!"
        echo "📥 Pulling latest code updates..."
        
        if git pull --quiet 2>/dev/null || git pull --rebase --quiet 2>/dev/null; then
          echo "✨ Successfully updated to the latest GitHub release!"
          MUST_INSTALL_DEPS=1
        else
          echo "⚠️ Automatic update skipped (local changes detected or merge conflict)."
        fi
      else
        echo "✅ Repository is up to date with GitHub."
      fi
    else
      echo "ℹ️  Could not check GitHub for updates (offline or no remote configured)."
    fi
  fi
}

check_github_updates

# 2. Ensure dependencies are installed
if [ ! -d "node_modules" ] || [ -n "$MUST_INSTALL_DEPS" ]; then
  echo "📦 Ensuring npm dependencies are installed..."
  npm install
fi

# 3. Build the application (Vite client + esbuild CJS server)
echo "🔨 Building client assets & compiling server.ts..."
npm run build

# 3. Helper function to open the default system browser
open_browser() {
  echo "⌛ Waiting for server to initialize on ${URL}..."
  
  # Wait for server port to be active
  for i in {1..20}; do
    if command -v nc >/dev/null 2>&1 && nc -z localhost "${PORT}" 2>/dev/null; then
      break
    fi
    sleep 0.5
  done

  echo "🌐 Opening default web browser at ${URL}..."

  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$URL"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xdg-open >/dev/null 2>&1; then
      xdg-open "$URL"
    elif command -v wslview >/dev/null 2>&1; then
      wslview "$URL"
    else
      echo "ℹ️  Server ready! Please open ${URL} in your browser."
    fi
  elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    start "$URL"
  else
    echo "ℹ️  Server ready! Please open ${URL} in your browser."
  fi
}

# Run open_browser in background so it triggers as soon as Express starts
open_browser &

# 4. Launch the compiled production server
echo "⚡ Launching Express server on port ${PORT}..."
npm start
