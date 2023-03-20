import type { UserConfig } from 'vitest/config'

export default {
  test: {
    // `.test.ts` => Jest
    // `.spec.ts` => Vitest
    include: ['{.github/**,**}/*.spec.ts'],
    outputTruncateLength: Infinity
  }
} satisfies UserConfig
