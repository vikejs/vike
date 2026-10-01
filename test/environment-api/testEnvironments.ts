export { testEnvironments }

import { test, expect, fetchHtml } from '@brillout/test-e2e'

function testEnvironments() {
  test('the server environment calls a function of the worker environment', async () => {
    const html = await fetchHtml('/environments')
    expect(html).toContain(
      escape({
        viteEnvironmentName: 'ssr',
        hasWorkerConfig: false,
        writtenByWorker: true,
        workerGreeting: 'Hello from the worker environment',
      }),
    )
    expect(html).toContain(
      escape({
        viteEnvironmentName: 'worker',
        configNames: ['getWorkerInfo', 'workerGreeting', 'workerSuffixed'],
        workerGreeting: 'Worker: Hello from the worker environment',
        workerSuffixed: 'Defined by +workerSuffixed.worker.js',
        urlPathname: '/environments',
      }),
    )
  })
}

function escape(value: unknown) {
  return JSON.stringify(value).replaceAll('"', '&quot;')
}
