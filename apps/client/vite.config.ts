import { defineConfig  } from 'vite'
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
      scss: {
        api: 'modern-compiler'
      },
      sass: {
        additionalData: '@use "./src/assets/styles/_variables.module.scss";'
      }
    }
  },
  server: {
    host: '0.0.0.0'
  },
  base: '/',
  ...(process.env.NODE_ENV === 'development' && { envDir: '../../' })
})
