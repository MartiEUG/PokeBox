import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function figmaAssetPlugin() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        // Return a virtual module for figma assets
        return '\0figma-asset:' + id
      }
    },
    load(id) {
      if (id.startsWith('\0figma-asset:')) {
        // Return empty module for figma assets
        return 'export default "";'
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), figmaAssetPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
