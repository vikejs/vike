import { runCommandThatTerminates, expect } from '@brillout/test-e2e'

let err: any
try {
  await runCommandThatTerminates('pnpm run build')
} catch (err_) {
  err = err_
}
expect(err).toBeTruthy()
expect(err.message).toContain(
  'import.meta.env.SOME_ENV used in /pages/index/+Page.jsx and therefore included in client-side bundle which can be be a security leak, remove import.meta.env.SOME_ENV or rename SOME_ENV to PUBLIC_SOME_ENV, see https://vite-plugin-ssr.com/env'
)
