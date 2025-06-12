import { fetchHtml, test, expect, run } from '@brillout/test-e2e'

run('npm run prod', {
  // Randomfly fails because of the GraphQL API
  isFlaky: true,
})

test('page is rendered to HTML', async () => {
  const html = await fetchHtml('/')
  expect(html).toContain('<li>Angola</li><li>Antarctica</li><li>Argentina</li><li>American Samoa</li>')
})
