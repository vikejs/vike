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
    expectNumbers(setGloballyClient, setGloballyServer)

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
      const setGloballyServerNew = await page.textContent('#setGloballyServer')
      const setGloballyClientNew = await page.textContent('#setGloballyClient')
      expectNumbers(setGloballyClientNew, setGloballyServerNew)
      expect(setGloballyServerNew).toBe(setGloballyServer)
      expect(setGloballyClientNew).toBe(setGloballyClient)
    }

    // Full page reload
    await page.goto(getServerUrl() + '/')
    await testCounter()
    const setGloballyServerNew = await page.textContent('#setGloballyServer')
    const setGloballyClientNew = await page.textContent('#setGloballyClient')
    expectNumbers(setGloballyClientNew, setGloballyServerNew)
    expect(setGloballyServerNew).toBe(setGloballyServer)
    expect(setGloballyClientNew).not.toBe(setGloballyClient)
  })
}

function expectNumbers(setGloballyClient: string | null, setGloballyServer: string | null) {
  expect(isNaN(parseInt(setGloballyServer!, 10))).toBe(false)
  expect(isNaN(parseInt(setGloballyClient!, 10))).toBe(false)
  expect(isNaN(parseInt('hydrating...', 10))).toBe(true)
}
