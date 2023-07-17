import { autoRetry, fetchHtml, page, test, expect, run, getServerUrl } from '@brillout/test-e2e'
import { testCounter } from '../../test/utils'

run('npm run dev')

test('page content is rendered to HTML', async () => {
  const htmlHome = await fetchHtml('/')
  expect(htmlHome).toContain('<h2>Home</h2>')
  const htmlAbout = await fetchHtml('/about')
  expect(htmlAbout).toContain('<h2>About</h2>')
})

test('page content is rendered to DOM', async () => {
  page.goto(`${getServerUrl()}/`)
  await testCounter()

  // Count state is preserved when navigating to `/about`
  expect(await page.textContent('h2')).toContain('Home')
  await page.click('a[href="/about"]')
  await autoRetry(async () => {
    expect(await page.textContent('h2')).toContain('About')
  })
  expect(await page.textContent('button')).toContain('Counter 1')
})
