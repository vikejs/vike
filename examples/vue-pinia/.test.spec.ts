import { fetchHtml, run } from '../../libframe/test/setup'

run('npm run start')

test('page content is rendered to HTML', async () => {
  const html = await fetchHtml('/')
  expect(html).toContain('<h2>To-do List</h2>')
  expect(html).toContain('Buy milk')
  expect(html).toContain('Buy chocolate')
  expect(html).toContain(
    '"INITIAL_STATE":{"todos":{"todoList":[{"id":0,"text":"Buy milk"},{"id":1,"text":"Buy chocolate"}]},"counter":{"count":0}}',
  )
})
