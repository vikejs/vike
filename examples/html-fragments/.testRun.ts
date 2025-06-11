export { testRun }

import { run, fetchHtml, test, expect, expectLog } from '@brillout/test-e2e'

function testRun(cmd: 'npm run dev' | 'npm run preview') {
  run(cmd)

  const isDev = !cmd.includes('preview')

  test('HTML Fragments', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('<div id="1"><b>I was defined by an HTML Fragment</b></div>')
    expect(html).toContain('<div id="2">&lt;b&gt;I was defined without an HTML Fragment&lt;/b&gt;</div>')
    expect(html).toContain('<div>Empty Fragments: 01</div>')
    if (isDev) {
      expectLog('The 2nd HTML variable', {
        filter: (log) =>
          log.logSource === 'stderr' &&
          log.logText.includes(
            'The 2nd HTML variable is <b>I was defined without an HTML Fragment</b> which seems to be HTML code',
          ) &&
          log.logText.includes('Did you forget to wrap the value with dangerouslySkipEscape'),
      })
    }
  })
}
