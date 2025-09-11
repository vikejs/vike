export { testRun }
export { testCloudflareBindings }

import { autoRetry, expect, getServerUrl, page, test } from '@brillout/test-e2e'
import { testCounter, testRunClassic } from '../../test/utils'

type CMD = 'npm run dev' | 'npm run preview'

function testRun(cmd: CMD) {
  testCloudflareBindings()
  testRunClassic(cmd)
  testTodolist()
}

function testCloudflareBindings() {
  test('Cloudflare Bindings', async () => {
    await page.goto(getServerUrl() + '/')
    await testCounter()
    const bodyText = await page.textContent('body')
    expect(bodyText).toContain('someEnvVar')
    expect(bodyText).toContain('some-value')
    expect(bodyText).toContain(`pageContext.globalContext.someEnvVar === ${JSON.stringify('some-value')}`)
  })
}

function testTodolist() {
  test('To-Do list', async () => {
    await page.goto(getServerUrl() + '/todo')
    await page.locator('button', { hasText: 'Reset' }).click()
    await autoRetry(
      async () => {
        expect(await getNumberOfItems()).toBe(3)
      },
      { timeout: 5000 },
    )
    {
      const reactText = await page.textContent('#root')
      expect(reactText).toContain('Buy milk')
      expect(reactText).not.toContain('Buy bananas')
    }
    const todoItemNew = `Buy bananas ${Math.random()}`
    await page.fill('input[type="text"]', todoItemNew)
    await page.click('button[type="submit"]')
    await autoRetry(
      async () => {
        expect(await getNumberOfItems()).toBe(4)
      },
      { timeout: 5000 },
    )
    expect(await page.textContent('#root')).toContain(todoItemNew)
    await fullPageReload()
    expect(await getNumberOfItems()).toBe(4)
    expect(await page.textContent('#root')).toContain(todoItemNew)
  })
}
async function getNumberOfItems() {
  return await page.evaluate(() => document.querySelectorAll('li').length)
}

async function fullPageReload() {
  await page.goto(getServerUrl() + '/')
  await testCounter()
  await page.goto(getServerUrl() + '/todo')
}
