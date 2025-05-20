export { testRedirectMailto }

import { test, getServerUrl, expect } from '@brillout/test-e2e'

function testRedirectMailto() {
  test('Redirect to URI without http protocol (e.g. `mailto:`)', async () => {
    const resp = await fetch(getServerUrl() + '/mail', { redirect: 'manual' })
    expect(resp.headers.get('Location')).toBe('mailto:some@example.com')
  })
  test('Redirect to external link', async () => {
    const res1 = await fetch(getServerUrl() + '/chat', { redirect: 'manual' })
    expect(res1.headers.get('Location')).toBe('https://discord.com/invite/hfHhnJyVg8')
    const res2 = await fetch(getServerUrl() + '/external-redirect', { redirect: 'manual' })
    expect(res2.headers.get('Location')).toBe(
      // https://github.com/vikejs/vike/issues/2462
      'https://app.nmrium.org#?toc=https://cheminfo.github.io/nmr-dataset-demo/samples.json'
    )
  })
}
