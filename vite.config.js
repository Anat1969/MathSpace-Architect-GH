import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // On GitHub Pages the app is served from /MathSpace-Architect-GH/.
  // In local dev it stays at the root.
  base: command === 'build' ? '/MathSpace-Architect-GH/' : '/',
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [
    // Kept only for the "@/" -> "/src/" path alias it provides.
    // All Base44 editor/analytics integrations are disabled — this is a
    // standalone static app with no Base44 backend.
    base44({
      legacySDKImports: false,
      hmrNotifier: false,
      navigationNotifier: false,
      analyticsTracker: false,
      visualEditAgent: false
    }),
    react(),
  ]
}));