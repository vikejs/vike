import type { Page } from 'playwright-chromium'
import type { partRegExp } from './utils'
import type fetch from 'node-fetch'

// globals injected in ./jestPerTestSetup.ts
declare global {
  const _page: Page
  const _partRegExp: typeof partRegExp
  const _fetch: typeof fetch
}
