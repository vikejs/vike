export { runMainIfNotImported }

import { fileURLToPath } from 'node:url'

// Run fn — exiting non-zero if it rejects — only when its module is executed directly, not imported.
// The caller passes its own import.meta.url so the check compares against the caller, not this file.
function runMainIfNotImported(moduleUrl: string, fn: () => Promise<void>): void {
  if (process.argv[1] !== fileURLToPath(moduleUrl)) return
  fn().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
