import type { UserConfig } from 'vitest/config'

export default {
  test: {
    // `.test.ts` => Jest
    // `.spec.ts` => Vitest
    include: ['{.github/**,**}/*.spec.ts'],
    // @ts-ignore
    outputTruncateLength: Infinity,
    threads: false
  }
} satisfies UserConfig
