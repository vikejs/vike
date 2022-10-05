import { test, expect, partRegex, run, fetchHtml, fetch, urlBase, isWindows } from '@brillout/test-e2e'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isDev = cmd === 'npm run dev'

  test('config includeAssetsImportedByServer', async () => {
    const html = await fetchHtml('/')

    expect(html).toContain(
      '<svg width="46.72" height="46.72" fill="none" version="1.1" viewBox="0 0 46.72 46.72" xmlns="http://www.w3.org/2000/svg">'
    )

    {
      const logoUrl: string = isDev
        ? '/pages/index/logo-1.svg'
        : html.match(partRegex`/assets/logo-1.${/[a-zA-Z0-9]+/}.svg`)[0]
      expect(html).toContain(`<img src="${logoUrl}" />`)

      const logoSrc: string = await (await fetch(urlBase + logoUrl)).text()
      expect(logoSrc).toContain(
        '<svg width="175" height="175" fill="none" version="1.1" viewBox="0 0 175 175" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">'
      )
    }

    {
      if (isDev) {
        const scriptUrl = '/pages/index/script.js'
        expect(html).toContain(`<script src="${scriptUrl}"></script>`)
        const scriptSrc: string = await (await fetch(urlBase + scriptUrl)).text()
        if (isWindows()) {
          expect(scriptSrc).toBe("console.log('bonjour');\r\n")
        } else {
          expect(scriptSrc).toBe("console.log('bonjour');\n")
        }
      } else {
        if (isWindows()) {
          expect(html).toContain(
            '<script src="data:application/javascript;base64,Y29uc29sZS5sb2coJ2JvbmpvdXInKTsNCg=="></script>'
          )
        } else {
          expect(html).toContain(
            '<script src="data:application/javascript;base64,Y29uc29sZS5sb2coJ2JvbmpvdXInKTsK"></script>'
          )
        }
      }
    }
  })
}
