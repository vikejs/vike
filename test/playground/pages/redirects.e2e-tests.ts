export { testRedirectMailto }

// Unit tests at /vike/node/runtime/renderPage/resolveRedirects.spec.ts
// https://github.com/vikejs/vike/blob/0e260ad6e64e98952138a90950e10e2d59d94a36/vike/node/runtime/renderPage/resolveRedirects.spec.ts

import { test, getServerUrl, expect } from '@brillout/test-e2e'

function testRedirectMailto() {
  test('+redirects', async () => {
    await testRedirect('/about-us', '/about')
    await testRedirect('/products/computer', '/produkte/komputer')
    /* TO-DO/eventually: it doesn't work — make it work
    '/product?category=computer': '/produkte?kategorie=komputer',
    */
    await testRedirect('/chat', 'https://discord.com/invite/hfHhnJyVg8')
    await testRedirect('/mail', 'mailto:some@example.com')
    await testRedirect('/download', 'magnet:?xt=urn:btih:example')
    await testRedirect('/product/42', '/buy/42')
    await testRedirect('/admin/some/nested-page?with&some-args', '/private/some/nested-page?with&some-args')
    await testRedirect(
      '/admins/some/nested-page?with&some-args',
      'https://admin.example.org/some/nested-page?with&some-args'
    )
    await testRedirect(
      '/external-redirect',
      'https://app.nmrium.org#?toc=https://cheminfo.github.io/nmr-dataset-demo/samples.json'
    )
  })
}

async function testRedirect(source: string, target: string) {
  const resp = await fetch(getServerUrl() + source, { redirect: 'manual' })
  expect(resp.headers.get('Location')).toBe(target)
}
