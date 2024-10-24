import { defineConfig  } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    optimizeDeps: {
      include: ['@expedients/types']
    },
    build: {
      commonjsOptions: {
        include: [/shared/, /node_modules/]
      }
    },
    server: {
      host: '0.0.0.0'
    },
    base: './',
    ...(process.env.NODE_ENV === 'development' && { envDir: '../../' })
  }
})
