import { autoRetry, fetchHtml, page, run, urlBase } from '../../libframe/test/setup'

testRun()

function testRun() {
  run('npm run start')

  test('page is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<div> Name character: Rick Sanchez</div>')
  })
}
