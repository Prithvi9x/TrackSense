import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT for GitHub Pages:
// If you deploy to https://<username>.github.io/<repo-name>/, set `base` to
// '/<repo-name>/'. If you deploy to a user/org page (https://<username>.github.io/),
// set `base` to '/'.
export default defineConfig({
  plugins: [react()],
  base: '/TrackSense/',
})
