export { testOnCreateGlobalContext }

import { autoRetry, editFile, editFileRevert, expect, fetchHtml, getServerUrl, page, test } from '@brillout/test-e2e'
import { testCounter } from '../utils'

function testOnCreateGlobalContext(isDev: boolean) {
  test('+onCreateGlobalContext', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<span id="setGloballyClient">hydrating...</span>')
    await page.goto(getServerUrl() + '/')
    const setGloballyServer = await page.textContent('#setGloballyServer')
    expect(html).toContain(`<span id="setGloballyServer">${setGloballyServer}</span>`)
    await testCounter()
    const setGloballyClient = await page.textContent('#setGloballyClient')

    // Client-side navigation
    await page.click('a[href="/markdown"]')
    await testCounter()
    expect(await page.textContent('#setGloballyServer')).toBe(setGloballyServer)
    expect(await page.textContent('#setGloballyClient')).toBe(setGloballyClient)

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
      expect(await page.textContent('#setGloballyServer')).toBe(setGloballyServer)
      expect(await page.textContent('#setGloballyClient')).toBe(setGloballyClient)
    }

    // Full page reload
    await page.goto(getServerUrl() + '/')
    await testCounter()
    expect(await page.textContent('#setGloballyServer')).toBe(setGloballyServer)
    expect(await page.textContent('#setGloballyClient')).not.toBe(setGloballyClient)
  })
}
