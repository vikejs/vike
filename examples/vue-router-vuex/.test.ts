import { autoRetry, fetchHtml, page, partRegex, run, urlBase } from '../../libframe/test/setup'

run('npm run dev')

test('page content is rendered to HTML', async () => {
  const htmlHome = await fetchHtml('/')
  expect(htmlHome).toMatch(partRegex`<h1 data-v-${/[^\>]*/}>Home</h1>`)
  const htmlAbout = await fetchHtml('/about')
  expect(htmlAbout).toMatch(partRegex`<h1 data-v-${/[^\>]*/}>About</h1>`)
})

test('page content is rendered to DOM', async () => {
  page.goto(`${urlBase}/`)
  expect(await page.textContent('button')).toContain('count is: 0')
  // `autoRetry` because browser-side code may not be loaded yet
  await autoRetry(async () => {
    await page.click('button')
    expect(await page.textContent('button')).toContain('count is: 1')
  })

  // Count state is preserved when navigating to `/about`
  expect(await page.textContent('h1')).toContain('Home')
  await page.click('a[href="/about"]')
  await autoRetry(async () => {
    expect(await page.textContent('h1')).toContain('About')
  })
  expect(await page.textContent('button')).toContain('count is: 1')
})
