export { testRun as test }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry, expectLog, partRegex, sleep } from '@brillout/test-e2e'
import { ensureWasClientSideRouted, expectUrl, testCounter, expectPageContextJsonRequest } from '../utils'

function testRun(
  cmd: 'npm run dev:server' | 'npm run dev' | 'npm run preview' | 'npm run prod',
  pageContextInitIsPassedToClient = false,
) {
  run(cmd)

  // See `someFakeData` in server/index.js
  const isMakingPageContextJsonRequest = cmd === 'npm run dev:server' || cmd === 'npm run prod'
  const isDev = cmd === 'npm run dev' || cmd === 'npm run dev:server'

  {
    const url = getServerUrl() + '/show-error-page'
    const expectErrServer = () => {
      // Maybe we should also show a log in production?
      if (cmd === 'npm run prod') return
      expectLog('HTTP response /show-error-page 666', { filter: (log) => log.logSource === 'stderr' })
    }
    test('render error page - HTML', async () => {
      const response = await fetch(url)
      expect(response.status).toBe(666)
      expectErrServer()
      expectLog('Unexpected status code 666', { filter: (log) => log.logSource === 'stderr' })
      const html = await response.text()
      expect(html).toContain('Testing throw render error page.')
      expect(html).toContain('<p style="font-size:1.3em">Testing throw render error page.</p>')
      expect(html).toContain('"abortReason":"Testing throw render error page."')
    })
    test('render error page - client-side routing', async () => {
      await page.goto(getServerUrl() + '/about')
      await expectUrl('/about')
      await hydrationDone()
      console.log('pageContextInitIsPassedToClient', pageContextInitIsPassedToClient)
      const done = expectPageContextJsonRequest(pageContextInitIsPassedToClient)
      await page.click('a[href="/show-error-page"]')
      console.log(1)
      await testCounter()
      console.log(2)
      done()
      expect(await page.textContent('p')).toBe('Testing throw render error page.')
      await expectUrl('/show-error-page')
      await ensureWasClientSideRouted('/pages/about')
      if (
        // guard() is called on the client-side => warning is shown on the server-side (not on the client-side)
        !isMakingPageContextJsonRequest &&
        // The warning isn't shown on the client-side in production
        isDev
      )
        expectLog('Unexpected status code 666', { filter: (log) => log.logSource === 'Browser Warning' })
    })
  }
}

async function hydrationDone() {
  await testCounter()
}
