export { testRun }
export { viteConfig }

import { expect, describe, it } from 'vitest'

const viteConfig = {
  logLevel: 'warn' as const,
  root: __dirname,
  configFile: __dirname + '/vite.config.js'
}
const urlBase = 'http://localhost:3000'

function testRun() {
  describe('Vitest', () => {
    it('run Vitest with Vike', { timeout: 10 * 1000 }, async () => {
      {
        const html = await fetchHtml('/')
        expect(html).toContain('<h1>Welcome</h1>')
        expect(html).toContain('<li>Rendered to HTML.</li>')
      }
      {
        const html = await fetchHtml('/about')
        expect(html).toContain('<h1>About</h1>')
        expect(html).toContain('<p>Example of using Vike.</p>')
      }
    })
  })
}

async function fetchHtml(urlPathname: string) {
  const ret = await fetch(urlBase + urlPathname)
  const html = await ret.text()
  return html
}
