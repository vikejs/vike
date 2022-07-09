export { testRun }

import { fetchHtml, run } from '../../libframe/test/setup'
import * as vite from 'vite'
const viteVersion = (vite as { version?: string }).version || '2.?.?'

function testRun(cmd: 'npm run dev' | 'npm run prod') {
  run(cmd)

  if (cmd === 'npm run prod' && viteVersion.startsWith('3')) {
    // https://github.com/apollographql/apollo-client/issues/9833
    // https://github.com/apollographql/apollo-client/issues/9834
    const msg = 'SKIPPED Apollo GrpahQL production test until it supports Vite 3.'
    console.log(msg)
    test(msg, () => {})
    return
  }

  test('page is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<div>Name character: Rick Sanchez</div>')
  })
}
