export { testSkipGuardAndData }

import { expect, fetch, getServerUrl, test } from '@brillout/test-e2e'

function testSkipGuardAndData() {
  test('pageContext.skipGuardAndData_experimentalRSC', async () => {
    const resp = await fetch(getServerUrl() + '/skip-guard-and-data')
    expect(resp.status).toBe(200)
    expect(await resp.text()).toContain('guard() and data() were skipped.')
  })
}
