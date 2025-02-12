// TODO/now move other tests here

export { testHMRPlusValueFile }

import { autoRetry, editFile, editFileRevert, expect, fetchHtml, test } from '@brillout/test-e2e'

function testHMRPlusValueFile(isDev: boolean) {
  if (!isDev) return
  test('HMR +{configName}.js dependency', async () => {
    await expectHtmlAttr('dark')
    editFile('./htmlAttrs.ts', (s) => s.replace('dark', 'light'))
    await expectHtmlAttr('light')
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
    { timeout: 5000 }
  )
}
