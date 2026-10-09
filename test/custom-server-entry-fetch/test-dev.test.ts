import { test, expect, fetch, fetchHtml, getServerUrl } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

testRunClassic('pnpm run dev', { serverIsReadyMessage: 'Server running at' })

test('globalContext.devMiddleware is Vite development middleware', async () => {
  expect(await fetchHtml('/dev-middleware-is-vite')).toBe('true')
  const response = await fetch(getServerUrl() + '/@vite/client')
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toContain('javascript')
})
