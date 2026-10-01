import { test, expect, getServerUrl } from '@brillout/test-e2e'
import { testRunClassic } from '../utils'

testRunClassic('pnpm run dev')

test('+middleware', async () => {
  const response = await fetch(getServerUrl() + '/')
  expect(response.headers.get('x-middleware')).toBe('ran')
})
