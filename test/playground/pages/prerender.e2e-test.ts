import fs from 'fs'
import path from 'path'
import { expect, test } from '@brillout/test-e2e'
import { EndToEndTestOptions } from '../utils/EndToEndTestOptions'

function testPrerenderSettings({ isDev, rootDir }: EndToEndTestOptions) {
  if (!isDev) {
    test('pre-render settings', async () => {
      ;[
        ['markdown', true],
        ['pushState', false],
        ['index', false],
        ['about', false]
      ].forEach(([page, exists]) => {
        expect(fs.existsSync(path.join(rootDir, `./dist/nested/client/${page}.html`))).toBe(exists)
        expect(fs.existsSync(path.join(rootDir, `./dist/nested/client/${page}/index.pageContext.json`))).toBe(exists)
      })
    })
  }
}

export default [testPrerenderSettings]
