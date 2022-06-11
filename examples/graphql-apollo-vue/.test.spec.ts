import { fetchHtml, run } from '../../libframe/test/setup'

testRun()

function testRun() {
  run('npm run dev')

  test('page is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<div>Name character: Rick Sanchez</div>')
  })
}
