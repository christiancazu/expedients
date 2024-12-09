import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@expedients/shared']
  },
  build: {
    commonjsOptions: {
      include: [/shared/, /node_modules/]
    }
  },
  css: {
    modules: {
      scopeBehaviour: 'global'
    },
    preprocessorOptions: {
      sass: {
      },
      scss: {
        silenceDeprecations: ['legacy-js-api'],
        additionalData: '@use "./src/assets/styles/_variables.scss" as *;'
      }
    }
  },
  server: {
    host: '0.0.0.0'
  },
  base: '/',
  ...(process.env.NODE_ENV === 'development' && { envDir: '../../' })
})
