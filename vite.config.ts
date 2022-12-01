import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp'

const srcAlias = fs.readdirSync(path.resolve(__dirname, './src')).map((dir) => {
  return {
    find: dir,
    replacement: path.resolve(__dirname, `./src/${dir}`),
  }
})
// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  resolve: {
    alias: [
      ...srcAlias,
      {
        find: 'routes',
        replacement: path.resolve(__dirname, `./src/routes`),
      },
      {
        find: 'lodash',
        replacement: 'lodash-es',
      },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    react(),
    command === 'build' && (visualizer() as any),
    vitePluginImp({
      libList: [
        {
          libName: 'lodash-es',
          libDirectory: '',
          camel2DashComponentName: false,
        },
      ],
    }),
  ],
  optimizeDeps: {
    force: false,
    include: [
      path.resolve(__dirname, './src/index.tsx'),
      'react',
      'react-dom',
      'lodash',
      'react-monaco-editor',
    ],
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router', 'react-router-dom'],
          verdor: ['moment'],
          lodash: ['lodash-es'],
          mui: ['@mui/material', '@mui/styles', '@mui/icons-material'],
          editor: ['jsoneditor', 'monaco-editor'],
        },
      },
    },
  },
}))
