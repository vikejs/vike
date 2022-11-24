import { renderPage } from '../../vite-plugin-ssr/node'
import { createServer } from 'vite'
import { expect, describe, it, beforeAll } from 'vitest'

beforeAll(async () => {
  await createDevServer()
})

/*/
const SKIP = true
/*/
const SKIP = false
//*/

describe('renderPage()', () => {
  it('works with HTML string', async () => {
    const body = await render(false)
    expect(body).toMatchInlineSnapshot(
      `
      "<html><head><script type=\\"module\\" async>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      </script></head><body><div><p>Hello</p></div></body></html>"
    `
    )
  })

  // Vitest + React 18 Streaming + Vite causes following:
  // ```
  // ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL  Command was killed with SIGSEGV (Segmentation fault): vitest test/stream
  // ```
  // The error occurs during the `pageContext._viteDevServer.transformIndexHtml()` call: https://github.com/brillout/vite-plugin-ssr/blob/d7a45b6b0bf27386c6dbdcdd6b630823e76ace85/vite-plugin-ssr/node/html/injectAssets/getViteDevScripts.ts#L22
  if (SKIP) {
    const msg = 'SKIPPED: streaming is causing segfault'
    it(msg, () => {})
    return
  } else {
    it('works with HTML stream', async () => {
      const body = await render(true)
      expect(body).toMatchInlineSnapshot(
        `
        "<html><head><script type=\\"module\\" async>
        import RefreshRuntime from \\"/@react-refresh\\"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
        import(\\"/@vite/client\\");
        </script></head><body><div><p>Hello</p></div></body></html>"
      `
      )
    })
  }
})

async function render(withStream: boolean): Promise<string> {
  const pageContext = await renderPage({ urlOriginal: '/', withStream })
  const { body } = pageContext.httpResponse
  return body
}

async function createDevServer() {
  await createServer({
    root: __dirname,
    server: { middlewareMode: true }
  })
}
