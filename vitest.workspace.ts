import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      include: ['vike/**/*.spec.ts'],
      name: 'unit',
      env: {
        FORCE_COLOR: '1'
      }
    }
  },
  {
    test: {
      // test/**/*.test.ts => @brillout/test-e2e
      include: ['test/**/*.spec.ts'],
      name: 'e2e'
    }
  }
])
