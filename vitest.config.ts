import { defineConfig } from 'vitest/config'

const env = {
  NO_COLOR: '1',
}

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ['packages/**/*.spec.ts', '.github/**/*.spec.ts'],
          exclude: [
            '**/node_modules/**',
            './packages/vike/src/node/vite/shared/resolveVikeConfigInternal/crawlPlusFilePaths/test-file-structure/**',
            '.github/workflows/ci/prepare.spec.ts',
          ],
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
          fileParallelism: false,
        },
      },
    ],
  },
})
