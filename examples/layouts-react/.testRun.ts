import { page, run, autoRetry, urlBase } from '../../libframe/test/setup'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run preview', uiFrameworkRoot: 'react-root' | 'app' = 'react-root') {
  run(cmd)

  test('landing page', async () => {
    await page.goto(urlBase + '/')

    // Landing page layout
    await testLayoutWidth(700)
  })

  test('about page', async () => {
    await page.goto(urlBase + '/about')

    // Default layout
    await testLayoutWidth(900)
  })

  test('starship page', async () => {
    await page.goto(urlBase + '/starship')

    // Default layout
    await testLayoutWidth(900)

    // Counter
    expect(await page.textContent('button')).toBe('Counter 0')
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toBe('Counter 1')
    })

    // Nested layout navigation
    const textOverview = "The Starship will, at term, repalce all SpaceX's rocket models."
    const textReviews = 'The Starship brought me and my family to Mars safely.'
    const textTechSpec = 'PROPELLANT CAPACITY'
    {
      const text = await page.textContent('body')
      expect(text).toContain(textOverview)
      expect(text).not.toContain(textReviews)
      expect(text).not.toContain(textTechSpec)
      expect(await page.textContent('button')).toBe('Counter 1')
    }
    {
      await page.click('a[href="/starship/reviews"]')
      let text: string
      await autoRetry(async () => {
        text = await page.textContent('body')
        expect(text).toContain(textReviews)
      })
      expect(text).not.toContain(textOverview)
      expect(text).not.toContain(textTechSpec)
      expect(await page.textContent('button')).toBe('Counter 1')
    }
    {
      await page.click('a[href="/starship/spec"]')
      let text: string
      await autoRetry(async () => {
        text = await page.textContent('body')
        expect(text).toContain(textTechSpec)
      })
      expect(text).not.toContain(textOverview)
      expect(text).not.toContain(textReviews)
      expect(await page.textContent('button')).toBe('Counter 1')
    }
  })

  async function testLayoutWidth(width: 700 | 900) {
    expect(await page.$eval(`#${uiFrameworkRoot} > div`, (e) => getComputedStyle(e).width)).toBe(width + 'px')
  }
}
