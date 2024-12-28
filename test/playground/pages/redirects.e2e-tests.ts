export { testRedirectMailto }

import { test, getServerUrl, expect } from '@brillout/test-e2e'

function testRedirectMailto() {
  test('Redirect to URI without http protocol (e.g. `mailto:`)', async () => {
    const resp = await fetch(getServerUrl() + '/mail', { redirect: 'manual' })
    expect(resp.headers.get('Location')).toBe('mailto:some@example.com')
  })
}
