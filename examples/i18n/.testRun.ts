import { run, page, urlBase, fetchHtml, autoRetry } from '../../libframe/test/setup'

export { testRun }

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  test('localized content is rendered to HTML', async () => {
    const html = await fetchHtml('/de-DE')
    expect(html).toContain('<h1>Wilkommen</h1>')
  })

  test('localized page is rendered to the DOM and interactive', async () => {
    await page.goto(urlBase + '/fr-FR')
    expect(await page.textContent('h1')).toBe('Bienvenue')

    // Interactive button
    expect(await page.textContent('button')).toBe('Compteur 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Compteur 1')
    })

    // Localized routing
    expect(await page.$('a[href="/about"]')).toBeNull()
    expect(await page.$('a[href="/fr-FR/about"]')).not.toBeNull()
    await page.click('a[href="/fr-FR/about"]')
    expect(await page.textContent('h1')).toBe('Bonjour')
    expect(await page.textContent('body')).toContain('Une autre page')
  })

  test('default locale', async () => {
    await page.goto(urlBase + '/')
    expect(await page.textContent('h1')).toContain('Welcome')
    expect(await page.$('a[href="/about"]')).not.toBeNull()
    expect(await page.$('a[href="/fr-FR/about"]')).toBeNull()
  })
}
