import { fetchHtml, test, expect, run, skip } from '@brillout/test-e2e'

run('npm run prod', {
  // Randomfly fails because of the GraphQL API
  isFlaky: true,
})

test('page is rendered to HTML', async () => {
  /* TO-DO/soon: uncomment this
  // API is down
  // https://github.com/trevorblades/countries/issues/78
  skip('SKIPPED: API is down')
  return
  //*/

  const html = await fetchHtml('/')
  expect(html).toContain('<li>Angola</li><li>Antarctica</li><li>Argentina</li><li>American Samoa</li>')
})
