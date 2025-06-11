import { test, expect, partRegex, run, fetchHtml, fetch, getServerUrl } from '@brillout/test-e2e'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isDev = cmd === 'npm run dev'

  test('config includeAssetsImportedByServer', async () => {
    const html = await fetchHtml('/')

    expect(html).toContain(
      '<svg width="46.72" height="46.72" fill="none" version="1.1" viewBox="0 0 46.72 46.72" xmlns="http://www.w3.org/2000/svg">',
    )

    const hash = /[a-zA-Z0-9_-]+/
    const logoUrl: string = isDev
      ? '/pages/index/logo-1.svg'
      : html.match(partRegex`/assets/static/logo-1.${hash}.svg`)![0]
    expect(html).toContain(`<img src="${logoUrl}" />`)

    const logoSrc: string = await (await fetch(getServerUrl() + logoUrl)).text()
    expect(logoSrc).toContain(
      '<svg width="175" height="175" fill="none" version="1.1" viewBox="0 0 175 175" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    )
  })
}
