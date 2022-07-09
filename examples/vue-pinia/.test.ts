import { fetchHtml, run, page, urlBase, autoRetry } from '../../libframe/test/setup'

testRun()

function testRun() {
  run('npm run dev')

  test('server-side', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Pinia Example</h1>')
    expect(html).toContain('<h2>To-do List</h2>')
    expect(html).toContain(
      '"todos":{"todoList":[{"id":0,"text":"Buy milk"},{"id":1,"text":"Buy chocolate"}]}',
    )
    expect(html).toContain('Buy milk')
    expect(html).toContain('Buy chocolate')
    expect(html).toContain(
      '"counter":{"count":0}',
    )
    expect(html).toContain('Counter 0')
  })

  test('client-side', async () => {
    await page.goto(urlBase + '/')

    // Interactive button
    expect(await page.textContent('button')).toBe('Counter 0')
    // `autoRetry` for waiting on hydration
    await autoRetry(async () => {
      await page.click('button')
      expect(await page.textContent('button')).toContain('Counter 1')
    })

    expect(await page.textContent('h1')).toBe('Pinia Example')
    expect(await page.textContent('h2')).toBe('To-do List')
    const firstTodoSelector = 'a[href="/todos/0"]'
    expect(await page.textContent(firstTodoSelector)).toBe('Buy milk')

    await page.click(firstTodoSelector)
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('To-do')
    })
    expect(await page.textContent('span')).toContain('Buy milk')

    await page.click('a[href="/"]')
    await autoRetry(async () => {
      expect(await page.textContent('h1')).toBe('Pinia Example')
    })
    expect(await page.textContent('button')).toContain('Counter 1')
  })
}
