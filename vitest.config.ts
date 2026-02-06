import { defineConfig } from 'vitest/config'

const env = {
  NO_COLOR: '1',
}

export default defineConfig({
  clearScreen: false,
  test: {
    projects: [
      {
        test: {
          include: ['packages/**/*.spec.ts'],
          name: 'unit',
          env,
        },
      },
      {
        test: {
          // **/*.test.ts => @brillout/test-e2e
          include: ['test/**/*.spec.ts'],
          name: 'e2e',
          env,
        },
      },
    ],
  },
})
