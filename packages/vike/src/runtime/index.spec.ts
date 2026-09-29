import { expect, it } from 'vitest'

it('`vike/runtime` stub throws, naming the `resolve.noExternal` fix', async () => {
  // - The stub is only loaded by code that Vite doesn't transform (e.g. an externalized npm package)
  await expect(import('./index.js')).rejects.toThrow(
    /"vike\/runtime" can only be imported by modules that Vite transforms.*"resolve\.noExternal"/,
  )
})
