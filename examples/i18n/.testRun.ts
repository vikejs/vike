export { testRun }

import { run, page, test, expect, getServerUrl, fetchHtml, autoRetry } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run preview', isDeprecatedDesign?: true) {
  run(cmd)

  test('localized content is rendered to HTML', async () => {
    const html = await fetchHtml('/de-DE')
    expect(html).toContain('<h1>Wilkommen</h1>')
  })

  test('localized page is rendered to the DOM and interactive', async () => {
    await page.goto(getServerUrl() + '/fr-FR')
    expect(await page.textContent('h1')).toBe('Bienvenue')

    // Interactive button
    expect(await page.textContent('button')).toBe('Compteur 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Compteur 1')
    })

    // Client routing
    await page.click('a[href="/de-DE/"]')
    await autoRetry(async () => {
      expect(await page.textContent('button')).toContain('Zähler 1')
    })
    await page.click('a[href="/fr-FR/"]')
    await autoRetry(async () => {
      expect(await page.textContent('button')).toContain('Compteur 1')
    })

    // Localized routing
    expect(await page.$('a[href="/about"]')).toBe(null)
    expect(await page.$('a[href="/fr-FR/about"]')).not.toBe(null)
    await page.click('a[href="/fr-FR/about"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Bonjour')
    })
    expect(await page.textContent('body')).toContain('Une autre page')

    // Data fetching
    await page.click('a[href="/fr-FR/movies"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Star Wars Les Films')
    })
    expect(await page.textContent('body')).toContain('Return of the Jedi')
  })

  test('default locale', async () => {
    await page.goto(getServerUrl() + '/')
    expect(await page.textContent('h1')).toContain('Welcome')
    expect(await page.$('a[href="/about"]')).not.toBe(null)
    expect(await page.$('a[href="/fr-FR/about"]')).toBe(null)
  })

  if (!isDeprecatedDesign) {
    test('404 page', async () => {
      expect(await fetchHtml('/404')).toContain('Page not found')
      expect(await fetchHtml('/de-DE/404')).toContain('Seite nicht gefunden')
      expect(await fetchHtml('/fr-FR/404')).toContain('Page non trouvé')
    })
  }
}
