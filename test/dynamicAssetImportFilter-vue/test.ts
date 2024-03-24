export { testRun as test }

import { fetchHtml, run, page, test, expect, getServerUrl } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run preview') {

  run(cmd)

  const isDev = cmd === 'npm run dev'

  test('dynamicAssetImportFilter-vue - server-side', async () => {

    const htmlOne = await fetchHtml('/one')
    expect(htmlOne).toContain(getAssetLink('Test1', isDev))
    expect(htmlOne).not.toContain(getAssetLink('Test2', isDev))
    expect(htmlOne).not.toContain(getAssetLink('Test3', isDev))

    const htmlTwo = await fetchHtml('/two')
    expect(htmlTwo).not.toContain(getAssetLink('Test1', isDev))
    expect(htmlTwo).toContain(getAssetLink('Test2', isDev))
    expect(htmlTwo).not.toContain(getAssetLink('Test3', isDev))

    const htmlOneAndTwo = await fetchHtml('/one_and_two')
    expect(htmlOneAndTwo).toContain(getAssetLink('Test1', isDev))
    expect(htmlOneAndTwo).toContain(getAssetLink('Test2', isDev))
    expect(htmlOneAndTwo).not.toContain(getAssetLink('Test3', isDev))
  })

  test('dynamicAssetImportFilter-vue - client-side', async () => {

    await page.goto(getServerUrl() + '/one')
    const headOne = await page.evaluate(() => document.head.innerHTML)
    expect(headOne).toContain(getAssetLink('Test1', isDev))
    expect(headOne).not.toContain(getAssetLink('Test2', isDev))
    expect(headOne).not.toContain(getAssetLink('Test3', isDev))

    await page.goto(getServerUrl() + '/two')
    const headTwo = await page.evaluate(() => document.head.innerHTML)
    expect(headTwo).not.toContain(getAssetLink('Test1', isDev))
    expect(headTwo).toContain(getAssetLink('Test2', isDev))
    expect(headTwo).not.toContain(getAssetLink('Test3', isDev))

    await page.goto(getServerUrl() + '/one_and_two')
    const headOneAndTwo = await page.evaluate(() => document.head.innerHTML)
    expect(headOneAndTwo).toContain(getAssetLink('Test1', isDev))
    expect(headOneAndTwo).toContain(getAssetLink('Test2', isDev))
    expect(headOneAndTwo).not.toContain(getAssetLink('Test3', isDev))
  })
}

function getAssetLink(componentName, isDev) {
  const path = isDev ? `/components/${componentName}.vue` : `/assets/static/${componentName}.`
  return `<link rel="stylesheet" type="text/css" href="${path}`
}
