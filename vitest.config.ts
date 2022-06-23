import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // `.test.ts` => Jest
    // `.spec.ts` => Vitest
    include: ['{.github/**,**}/*.spec.ts'],
  },
})
