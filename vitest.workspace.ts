import { defineWorkspace } from 'vitest/config'

const env = {
  NO_COLOR: '1',
}

export default defineWorkspace([
  {
    test: {
      include: ['vike/**/*.spec.ts'],
      name: 'unit',
      env,
    },
  },
  {
    test: {
      // test/**/*.test.ts => @brillout/test-e2e
      include: ['test/**/*.spec.ts'],
      name: 'e2e',
      env,
    },
  },
])
