import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // GitHub Actions supplies the repository name, so the built files work at /repo/.
  base: command === 'build' ? (process.env.GITHUB_ACTIONS ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''}/` : '/') : '/',
  plugins: [react()],
}))
