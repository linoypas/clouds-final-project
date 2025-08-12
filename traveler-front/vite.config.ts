import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3010, // Change port if needed
  },
    preview: {
      allowedHosts: [
        'temp-alb-2063038463.us-east-1.elb.amazonaws.com'
      ],
      host: '0.0.0.0',
      port: 3010,
  },
})
