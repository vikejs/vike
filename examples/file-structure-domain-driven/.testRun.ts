import { page, run, urlBase, autoRetry } from '../../libframe/test/setup'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('Route strings', async () => {
    await page.goto(urlBase + '/products')
    const text = await page.textContent('#page-content')
    expect(text).toContain('Product list:')
    expect(text).toContain('Starship')
    expect(text).toContain('Mac Studio')
    expect(text).toContain('แจ็คเก็ตเดนิม')
    await page.click('a[href="/product/starship"]')
    await autoRetry(async () => {
      expect(await page.textContent('#page-content')).toBe('Product starship')
    })
    await page.click('a[href="/products"]')
    await autoRetry(async () => {
      expect(await page.textContent('#page-content')).toContain('Product list:')
    })
    await page.click('a[href="/product/แจ็คเก็ตเดนิม"]')
    await autoRetry(async () => {
      expect(await page.textContent('#page-content')).toBe('Product แจ็คเก็ตเดนิม')
    })
  })

  test("`export const filesystemRoutingRoot = '/'` in `_default.page.route.js`", async () => {
    await page.goto(urlBase + '/about')
    expect(await page.textContent('#page-content')).toBe('About page')
    await page.click('a[href="/"]')
    await autoRetry(async () => {
      expect(await page.textContent('#page-content')).toBe('Welcome')
    })
  })

  test('normal Filesystem Routing', async () => {
    await page.goto(urlBase + '/auth/login')
    expect(await page.textContent('#page-content')).toBe('Login page')
    await page.goto(urlBase + '/auth/signup')
    expect(await page.textContent('#page-content')).toBe('Signup page')
  })
}
