export { testRun }

import { page, test, expect, run, getServerUrl, autoRetry, fetchHtml } from '@brillout/test-e2e'

import * as fs from 'fs'
import * as cp from 'child_process'
import * as path from 'path'
import * as os from 'os'
import { fileURLToPath } from 'url'
//@ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  if (cmd === 'npm run dev') {
    run(cmd)
  } else {
    run(cmd)
    // const tmpDir = os.tmpdir()
    // const tmpTestDir = path.join(tmpDir, `vite-tmp-${Date.now()}`)
    // process.once('exit', (code) => {
    //   fs.rmSync(tmpTestDir, { recursive: true, force: true })
    //   process.exit(code)
    // })
    // cp.execSync('npm run build', { cwd: __dirname })
    // fs.mkdirSync(tmpTestDir)
    // fs.cpSync(path.join(__dirname, 'dist'), tmpTestDir, { recursive: true })

    // run(`cd ${tmpTestDir} && node dist/server/index.mjs`, {
    //   env: {
    //     NODE_ENV: 'production'
    //   }
    // })
  }

  test('HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>To-do List</h1>')
    expect(html).toContain('<li>Buy milk</li>')
    expect(html).toContain('<li>Buy strawberries</li>')
  })

  test('Add to-do item', async () => {
    await page.goto(`${getServerUrl()}/`)
    {
      const text = await page.textContent('body')
      expect(text).toContain('To-do List')
      expect(text).toContain('Buy milk')
      expect(text).toContain('Buy strawberries')
    }

    // Await hydration
    expect(await page.textContent('button[type="button"]')).toBe('Counter 0')
    await autoRetry(async () => {
      await page.click('button[type="button"]')
      expect(await page.textContent('button[type="button"]')).toContain('Counter 1')
    })

    // Await suspense boundary (for examples/react-streaming)
    await autoRetry(async () => {
      expect(await page.textContent('body')).toContain('Buy milk')
    })
    await page.fill('input[type="text"]', 'Buy bananas')
    await page.click('button[type="submit"]')
    await autoRetry(async () => {
      expect(await getNumberOfItems()).toBe(4)
    })
    expect(await page.textContent('body')).toContain('Buy bananas')
  })

  test('New to-do item is persisted & rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<li>Buy bananas</li>')
  })
}

async function getNumberOfItems() {
  return await page.evaluate(() => document.querySelectorAll('li').length)
}
