import { expect, getServerUrl, page, run, test } from '@brillout/test-e2e'
import { testCounter } from '../../test/utils'

run('npm run dev', { doNotFailOnWarning: true })

test('forbidden import', async () => {
  await page.goto(getServerUrl() + '/')
  await testCounter()
  expect('success').toBe('success')
})
