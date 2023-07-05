import { skip } from '@brillout/test-e2e'

export { testRun }

function testRun(_cmd: 'npm run preview') {
  skip(
    "Skip until Vite/Rollup bug is fixed. (Vite correctly adds the Sono font to chunk.viteMetadata.importedAssets but the chunk is missing in the `bunlde` argument of Rollup's generateBundle() hook. It isn't critical as it only happens with the 0.4 design.)"
  )
}
/*
import { test, expect, run, partRegex, fetchHtml } from '@brillout/test-e2e'

export { testRun }

function testRun(cmd: 'npm run preview') {
  run(cmd)

  const fontRE = partRegex`<link rel="preload" href="/assets/static/Sono-Light.${/[a-zA-Z0-9]+/}.ttf" as="font" type="font/ttf" crossorigin>`
  const logoRE = partRegex`<link rel="preload" href="/assets/static/logo.${/[a-zA-Z0-9]+/}.svg" as="image" type="image/svg+xml">`
  const styleRE = partRegex`<link rel="stylesheet" type="text/css" href="/assets/static/PageLayout.${/[a-zA-Z0-9]+/}.css">`
  const script1RE = partRegex`<script type="module" src="/assets/entries/entry-server-routing.${/[a-zA-Z0-9]+/}.js" defer></script>`
  const script2RE = partRegex`<link rel="modulepreload" href="/assets/entries/renderer_default.page.client.${/[a-zA-Z0-9]+/}.js" as="script" type="text/javascript">`

  const testCommon = (html: string) => {
    expect(html).toMatch(script1RE)
    expect(html).toMatch(script2RE)
    expect(html).toMatch(styleRE)
  }

  test('Default preloading', async () => {
    const html = await fetchHtml('/')
    testCommon(html)
    expect(html).not.toMatch(logoRE)
    expect(html).toMatch(fontRE)
  })

  test('Preload images', async () => {
    const html = await fetchHtml('/preload-images')
    testCommon(html)
    expect(html).toMatch(logoRE)
    expect(html).toMatch(fontRE)
  })

  test('Preload disabled', async () => {
    const html = await fetchHtml('/preload-disabled')
    testCommon(html)
    expect(html).not.toMatch(logoRE)
    expect(html).not.toMatch(fontRE)
  })
}
*/
