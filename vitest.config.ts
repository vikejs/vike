import type { UserConfig } from 'vitest/config'

export default {
  test: {
    // `.test.ts` => Jest
    // `.spec.ts` => Vitest
    include: ['**/*.spec.ts']
  }
} satisfies UserConfig
