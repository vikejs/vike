export { testVikeRuntime }

import { test, expect, fetchHtml, page, getServerUrl, autoRetry } from '@brillout/test-e2e'

function testVikeRuntime() {
  test('vike/runtime in the ssr and worker environments', async () => {
    const html = await fetchHtml('/vike-runtime')
    expect(html).toContain(
      escape({ environmentName: 'server', viteEnvironmentName: 'ssr', hasPage: true, hasWorkerConfig: false }),
    )
    expect(html).toContain(
      escape({
        environmentName: 'worker',
        viteEnvironmentName: 'worker',
        configNames: ['workerGreeting', 'workerSuffixed'],
        workerGreeting: 'Hello from the worker environment',
        workerSuffixed: 'Defined by +workerSuffixed.worker.js',
      }),
    )
  })

  test('vike/runtime in the client environment', async () => {
    await page.goto(getServerUrl() + '/vike-runtime')
    await autoRetry(async () => {
      expect(await page.textContent('#client')).toBe(
        JSON.stringify({ environmentName: 'client', viteEnvironmentName: 'client', hasPage: true }),
      )
    })
  })
}

function escape(value: unknown) {
  return JSON.stringify(value).replaceAll('"', '&quot;')
}
