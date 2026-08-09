#!/usr/bin/env bash
# ==============================================================================
# Application Build, Start & Browser Launch Helper Script
# ==============================================================================

set -e

PORT=${PORT:-3000}
URL="http://localhost:${PORT}"

echo "🚀 Starting AI Studio Database Application setup..."

# 1. Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 'node_modules' directory not found. Running npm install..."
  npm install
fi

# 2. Build the application (Vite client + esbuild CJS server)
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
