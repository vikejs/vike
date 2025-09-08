export { testRun }
export { testCloudflareBindings }

import { expect, getServerUrl, page, test } from '@brillout/test-e2e'
import { testCounter, testRunClassic } from '../../test/utils'

type CMD = 'npm run dev' | 'npm run preview'

function testRun(cmd: CMD) {
  testCloudflareBindings()
  testRunClassic(cmd)
}

function testCloudflareBindings() {
  test('Cloudflare Bindings', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    const bodyText = await page.textContent('body')
    expect(bodyText).toContain('someEnvVar')
    expect(bodyText).toContain('some-value')
    expect(bodyText).toContain(`pageContext.globalContext.someEnvVar === ${JSON.stringify('some-value')}`)
  })
}
