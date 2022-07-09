import { autoRetry, fetchHtml, page, run, urlBase } from '../../libframe/test/setup'

run('npm run dev')

test('page content is rendered to HTML', async () => {
  const htmlHome = await fetchHtml('/')
  expect(htmlHome).toContain('<h2>Home</h2>')
  const htmlAbout = await fetchHtml('/about')
  expect(htmlAbout).toContain('<h2>About</h2>')
})

test('page content is rendered to DOM', async () => {
  page.goto(`${urlBase}/`)
  expect(await page.textContent('button')).toContain('Count: 0')
  // `autoRetry` because browser-side code may not be loaded yet
  await autoRetry(async () => {
    await page.click('button')
    expect(await page.textContent('button')).toContain('Count: 1')
  })

  // Count state is preserved when navigating to `/about`
  expect(await page.textContent('h2')).toContain('Home')
  await page.click('a[href="/about"]')
  await autoRetry(async () => {
    expect(await page.textContent('h2')).toContain('About')
  })
  expect(await page.textContent('button')).toContain('Count: 1')
})
