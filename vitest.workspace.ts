import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        test: {
          name: 'renderer',
          include: ['tests/renderer/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          globals: true,
          setupFiles: ['tests/renderer/setup.ts'],
        },
      },
      {
        test: {
          name: 'main',
          include: ['tests/main/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
})
