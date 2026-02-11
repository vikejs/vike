import { runCommandThatTerminates, expect } from '@brillout/test-e2e'

let err: any
try {
  await runCommandThatTerminates('pnpm run build')
} catch (err_) {
  err = err_
}
expect(err).toBe(undefined)
