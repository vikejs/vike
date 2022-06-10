export { testRun }

import { run, fetchHtml } from '../libframe/test/setup'

function testRun(cmd: 'pnpm run dev' | 'pnpm run preview') {
  run(cmd)

  /*
  const isPreview = cmd === 'pnpm run preview'
  const isDev = cmd === 'pnpm run dev'
  */

  test('page content is rendered to HTML', async () => {
    const html = await fetchHtml('/')
    expect(html).toContain(
      '<meta name="description" content="Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin." />',
    )
    expect(html).toContain('integrate tools manually')
  })
}
