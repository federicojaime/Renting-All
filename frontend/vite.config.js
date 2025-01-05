import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/renting-all/',
  server: {
    open: '/renting-all/'
  }
})