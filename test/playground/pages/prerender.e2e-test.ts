export { testPrerenderSettings }

import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@brillout/test-e2e'

function testPrerenderSettings({
  isDev,
  rootDir,
}: {
  isDev: boolean
  rootDir: string
}) {
  if (!isDev) {
    test('pre-render settings', async () => {
      ;[
        ['markdown', true],
        ['pushState', false],
        ['index', false],
        ['about', false],
      ].forEach(([page, exists]) => {
        expect(fs.existsSync(path.join(rootDir, `./dist/nested/client/${page}.html`))).toBe(exists)
        expect(fs.existsSync(path.join(rootDir, `./dist/nested/client/${page}/index.pageContext.json`))).toBe(exists)
      })
    })
  }
}
