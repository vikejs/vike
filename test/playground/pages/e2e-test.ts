// TODO/now move other tests here

export { testGlobalContext }
export { testHMRPlusValueFile }
export { testRedirectMailto }
export { testOnCreateGlobalContext }

import { autoRetry, editFile, editFileRevert, expect, fetchHtml, getServerUrl, page, test } from '@brillout/test-e2e'
import { sleepBeforeEditFile, testCounter } from '../../../test/utils'

function testHMRPlusValueFile(isDev: boolean) {
  if (!isDev) {
    return
  }
  test('HMR +{configName}.js dependency', async () => {
    await expectHtmlAttr('dark')
    editFile('./htmlAttrs.ts', (s) => s.replace('dark', 'light'))
    await expectHtmlAttr('light')
    await sleepBeforeEditFile()
    editFileRevert()
    await expectHtmlAttr('dark')
  })
}
async function expectHtmlAttr(val: 'dark' | 'light') {
  await autoRetry(
    async () => {
      const html = await fetchHtml('/')
      expect(html).toContain(`<html class="${val}" lang="en">`)
    },
    { timeout: 5 * 1000 }
  )
}

function testGlobalContext() {
  // See +onBeforeRender.ts and +Layout.tsx
  test('pageContext.globalContext.pages', async () => {
    const html = await fetchHtml('/')
    ;['/', '/about', '/markdown', '/pushState'].forEach((url) => {
      expect(html).toContain(`<a class="navitem" href="${url}" style="padding-right:20px">`)
    })
  })
}

// Unit tests at /vike/node/runtime/renderPage/resolveRedirects.spec.ts
// https://github.com/vikejs/vike/blob/0e260ad6e64e98952138a90950e10e2d59d94a36/vike/node/runtime/renderPage/resolveRedirects.spec.ts
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

function testOnCreateGlobalContext(isDev: boolean) {
  test('+onCreateGlobalContext', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<span id="setGloballyClient">hydrating...</span>')
    await page.goto(getServerUrl() + '/')
    const setGloballyServer = await page.textContent('#setGloballyServer')
    expect(html).toContain(`<span id="setGloballyServer">${setGloballyServer}</span>`)
    await testCounter()
    const setGloballyClient = await page.textContent('#setGloballyClient')
    expectNumbers(setGloballyClient, setGloballyServer)

    // Client-side navigation
    {
      await page.click('a[href="/markdown"]')
      await testCounter()
      const setGloballyServerNew = await page.textContent('#setGloballyServer')
      const setGloballyClientNew = await page.textContent('#setGloballyClient')
      expectNumbers(setGloballyClientNew, setGloballyServerNew)
      expect(setGloballyServerNew).toBe(setGloballyServer)
      expect(setGloballyClientNew).toBe(setGloballyClient)
    }

    // HMR
    if (isDev) {
      const org = 'number server-side'
      const mod = 'numrrr server-side'
      expect(await page.textContent('#footer')).toContain(org)
      editFile('./pages/+Layout.tsx', (s) => s.replace(org, mod))
      await autoRetry(async () => {
        expect(await page.textContent('#footer')).toContain(mod)
      })
      editFileRevert()
      await autoRetry(async () => {
        expect(await page.textContent('#footer')).toContain(org)
      })
      await testCounter(1)
      const setGloballyServerNew = await page.textContent('#setGloballyServer')
      const setGloballyClientNew = await page.textContent('#setGloballyClient')
      expectNumbers(setGloballyClientNew, setGloballyServerNew)
      expect(setGloballyServerNew).toBe(setGloballyServer)
      expect(setGloballyClientNew).toBe(setGloballyClient)
    }

    // Full page reload
    {
      await page.goto(getServerUrl() + '/')
      await testCounter()
      const setGloballyServerNew = await page.textContent('#setGloballyServer')
      const setGloballyClientNew = await page.textContent('#setGloballyClient')
      expectNumbers(setGloballyClientNew, setGloballyServerNew)
      expect(setGloballyServerNew).toBe(setGloballyServer)
      expect(setGloballyClientNew).not.toBe(setGloballyClient)
    }
  })
}
function expectNumbers(setGloballyClient: string | null, setGloballyServer: string | null) {
  expect(isNaN(parseInt(setGloballyServer!, 10))).toBe(false)
  expect(isNaN(parseInt(setGloballyClient!, 10))).toBe(false)
  expect(isNaN(parseInt('hydrating...', 10))).toBe(true)
}
