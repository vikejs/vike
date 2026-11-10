export { testRun }

import fs from 'node:fs'
import { run, page, test, expect, getServerUrl, editFile, editFileRevert, autoRetry } from '@brillout/test-e2e'
import {
  ensureWasClientSideRouted,
  expectPageContextJsonRequest,
  expectUrl,
  sleepBeforeEditFile,
  waitForNavigation,
} from '../utils'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview' | 'pnpm run preview:ssg') {
  run(cmd)

  const isDev = cmd === 'pnpm run dev'

  test('.pageContext.json request only for the page with a .server hook', async () => {
    await page.goto(getServerUrl() + '/')
    await waitForHydration()
    await navigate('/a', false)
    await navigate('/', false)
    await navigate('/b', true)
    await navigate('/', false)
  })

  if (isDev) {
    test('modifying a file read by +onCreatePageConfig_experimental', async () => {
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFile('./pages/a/+Page.js', (s) => `// needs-server\n${s}`)
        await reloaded()
      }
      await waitForHydration()
      await navigate('/a', true)
      await navigate('/', false)
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        editFileRevert()
        await reloaded()
      }
      await waitForHydration()
      await navigate('/a', false)
    })

    test('creating and removing a file read by +onCreatePageConfig_experimental', async () => {
      const markerFile = new URL('./pages/a/needs-server.txt', import.meta.url)
      await navigate('/', false)
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        fs.writeFileSync(markerFile, '')
        await reloaded()
      }
      await waitForHydration()
      await navigate('/a', true)
      await navigate('/', false)
      await sleepBeforeEditFile()
      {
        const reloaded = await waitForNavigation()
        fs.unlinkSync(markerFile)
        await reloaded()
      }
      await waitForHydration()
      await navigate('/a', false)
    })
  }
}

async function navigate(pathname: '/' | '/a' | '/b', isPageContextJsonRequest: boolean) {
  const done = expectPageContextJsonRequest(isPageContextJsonRequest)
  await page.click(`a[href="${pathname}"]`)
  await expectUrl(pathname)
  await autoRetry(async () => {
    expect(await page.textContent('h1')).toBe({ '/': 'Index', '/a': 'Page A', '/b': 'Page B' }[pathname])
  })
  await ensureWasClientSideRouted('/pages/index')
  done()
}

async function waitForHydration() {
  await page.waitForSelector('#root[data-hydrated]')
}
