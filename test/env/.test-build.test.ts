import { runCommandThatTerminates, expect } from '@brillout/test-e2e'

let err: any
try {
  await runCommandThatTerminates('pnpm run build')
} catch (err_) {
  err = err_
}
expect(err).toBeTruthy()
expect(err.message).toContain('import.meta.env.SOME_OTHER_ENV is used in client-side file /pages/index/+Page.jsx')
