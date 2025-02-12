// TODO/now move other tests here

export { testGlobalContext }
export { testHMRPlusValueFile }

import { autoRetry, editFile, editFileRevert, expect, fetchHtml, isWindows, sleep, test } from '@brillout/test-e2e'

function testHMRPlusValueFile(isDev: boolean) {
  if (
    !isDev ||
    // editFileRevert() doesn't seem to work on windows, I don't know why
    isWindows()
  ) {
    return
  }
  test('HMR +{configName}.js dependency', async () => {
    await expectHtmlAttr('dark')
    editFile('./htmlAttrs.ts', (s) => s.replace('dark', 'light'))
    await expectHtmlAttr('light')
    await hmrSleep()
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

// I don't know why it's needed, there seem to be some kind of race condition
async function hmrSleep() {
  await sleep(500)
}
