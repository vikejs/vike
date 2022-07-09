import { run, page, urlBase, fetchHtml, autoRetry, expectBrowserError } from '../../libframe/test/setup'

export { testRun }

function testRun(viewFramework: 'vue' | 'react', cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isDev = cmd === 'npm run dev'
  const isPreview = cmd === 'npm run preview'

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    if (viewFramework === 'react') {
      expect(html).toContain('<h1>Welcome to <!-- --><code>vite-plugin-ssr</code></h1>')
    } else {
      expect(html).toContain('<h1>Welcome to <code>vite-plugin-ssr</code></h1>')
    }
  })

  test('page is rendered to the DOM and interactive', async () => {
    await page.goto(urlBase + '/')
    expect(await page.textContent('h1')).toBe('Welcome to vite-plugin-ssr')

    // Interactive button
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })

    // Client-side routing
    await page.click('a[href="/star-wars"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Star Wars Movies')
    })
    expect(await page.textContent('body')).toContain('The Phantom Menace')

    // Page was Client-side Routed; we check whether the HTML is from the first page before Client-side Routing
    const html = await page.content()
    // `page.content()` doesn't return the original HTML (it dumps the DOM to HTML).
    // Therefore only the serialized `pageContext` tell us the original HTML.
    expect(html.split('_pageId').length).toBe(2)
    expect(html).toContain('"_pageId":"/pages/index"')
  })

  test('supports route functions', async () => {
    await page.goto(urlBase + '/hello/alice')
    expect(await page.textContent('h1')).toContain('Hello')
    expect(await page.textContent('body')).toContain('Hi alice')

    await page.goto(urlBase + '/hello/evan')
    expect(await page.textContent('h1')).toContain('Hello')
    expect(await page.textContent('body')).toContain('Hi evan')

    if (!isPreview) {
      await page.goto(urlBase + '/hello')
      expect(await page.textContent('body')).toContain('Hi anonymous')
      await page.goto(urlBase + '/hello/')
      expect(await page.textContent('body')).toContain('Hi anonymous')
    }
  })

  test('data fetching page, HTML', async () => {
    const html = await fetchHtml('/star-wars')
    if (viewFramework === 'react') {
      expect(html).toContain('<a href="/star-wars/6">Revenge of the Sith</a>')
      expect(html).toContain('<a href="/star-wars/4">The Phantom Menace</a>')
    }
    if (viewFramework === 'vue') {
      expect(html).toContain('<a href="/star-wars/6">Revenge of the Sith</a>')
      expect(html).toContain('<a href="/star-wars/4">The Phantom Menace</a>')
    }
  })

  test('data fetching page, DOM', async () => {
    await page.goto(urlBase + '/star-wars')
    const text = await page.textContent('body')
    expect(text).toContain('Revenge of the Sith')
    expect(text).toContain('The Phantom Menace')

    await page.click('a[href="/star-wars/4"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('The Phantom Menace')
    })
    const pageContent =
      viewFramework === 'vue'
        ? 'The Phantom Menace Release Date: 1999-05-19  Director: George Lucas  Producer: Rick McCallum'
        : 'The Phantom MenaceRelease Date: 1999-05-19Director: George LucasProducer: Rick McCallum'
    expect(await page.textContent('body')).toContain(pageContent)
  })

  test('markdown page HTML', async () => {
    const html = await fetchHtml('/markdown')
    expect(html).toContain('<title>Some Markdown Page</title>')
    if (viewFramework === 'react') {
      expect(html).toContain('This page is written in <!-- --><em>Markdown</em>')
    } else {
      expect(html).toContain('This page is written in <em>Markdown</em>')
    }
    if (viewFramework === 'react') {
      expect(html).toContain('<button>Counter <!-- -->0<!-- --></button>')
    } else {
      expect(html).toContain('<button>Counter 0</button>')
    }
  })

  test('markdown page DOM', async () => {
    await page.goto(urlBase + '/markdown')
    expect(await page.textContent('body')).toContain('This page is written in Markdown')
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` because browser-side code may not be loaded yet
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })
  })

  /* TODO - Does not work with `$ vite preview`, see https://github.com/vitejs/vite/pull/7665
  test('test 404 page', async () => {
    const html = await fetchHtml('/doesNotExist')
    expect(html).toContain('<h1>404 Page Not Found</h1>')
    expect(html).toContain('This page could not be found.')
  })
  //*/

  if (viewFramework === 'react') {
    test('async pageContext', async () => {
      const html = await fetchHtml('/')
      expect(html).toContain('"someAsyncProps":42')
    })
  }

  // In production, we pre-render all pages and thus `throw RenderErrorPage()` will never be called.
  if (viewFramework === 'react' && isDev) {
    test('throw RenderErrorPage', async () => {
      await page.goto(urlBase + '/hello/bob')
      expect(await page.textContent('h1')).toBe('404 Page Not Found')
      expectBrowserError(
        (browserLog) =>
          browserLog.logText.includes('http://localhost:3000/hello/bob') &&
          browserLog.logText.includes('Failed to load resource: the server responded with a status of 404 (Not Found)'),
      )
      const txt = 'Unknown name: bob.'
      expect(await page.textContent('body')).toContain(txt)
      const html = await fetchHtml('/hello/bob')
      expect(html).toContain(txt)
    })
  }
}
