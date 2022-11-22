import { expect, describe, it, beforeAll } from 'vitest'
import { renderPage } from '../../vite-plugin-ssr/node'
import { createServer } from 'vite'
import path from 'path'

beforeAll(async () => {
  await devApp()
}, 10 * 1000)

describe('preload tags', () => {
  it('Page 1', async () => {
    const { body, earlyHints } = await render('/')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
          "mediaType": "text/css",
          "src": "/renderer/PageLayout.css?direct",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html><head><link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\"></head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-font-only\\">Preload Only Font</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Default</h1><p>This page showcases the default preloading strategy: in production, both the image and the font are preloaded.</p></div></div></div>
              <script type=\\"module\\" async>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
      </script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/index\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </body>
          </html>"
    `
    )
  })
  it('Page 2', async () => {
    const { body, earlyHints } = await render('/preload-disabled')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
          "mediaType": "text/css",
          "src": "/renderer/PageLayout.css?direct",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html><head><link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\"></head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-font-only\\">Preload Only Font</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Disabled</h1><p>This page showcases completely disabled preloading: the image nor the font are preloaded.</p></div></div></div>
              <script type=\\"module\\" async>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
      </script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-disabled\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </body>
          </html>"
    `
    )
  })
  it('Page 3', async () => {
    const { body, earlyHints } = await render('/preload-font-only')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
          "mediaType": "text/css",
          "src": "/renderer/PageLayout.css?direct",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html><head><link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\"></head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-font-only\\">Preload Only Font</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Font Only</h1><p>This page showcases a custom strategy of only preloading the font (i.e. the image isn&#x27;t preloaded).</p></div></div></div>
              <script type=\\"module\\" async>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
      </script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-font-only\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </body>
          </html>"
    `
    )
  })
  it('Page 4', async () => {
    const { body, earlyHints } = await render('/preload-eager')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
          "mediaType": "text/css",
          "src": "/renderer/PageLayout.css?direct",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html><head><link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\"></head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-font-only\\">Preload Only Font</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Eager</h1><p>This page showcases eager preloading (non-JavaScript assets are preloaded ASAP).</p></div></div></div>
              <script type=\\"module\\" async>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
      </script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-eager\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </body>
          </html>"
    `
    )
  })
})

async function devApp() {
  await createServer({
    root: __dirname,
    server: { middlewareMode: true }
  })
}

async function render(urlOriginal: '/' | '/preload-disabled' | '/preload-font-only' | '/preload-eager') {
  const { httpResponse } = await renderPage({ urlOriginal })
  const body = stabilizePaths(httpResponse!.body)
  const earlyHints = httpResponse!.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | string]) => {
        val = val && stabilizePaths(val)
        return [key, val]
      })
    )
  )
  return { body, earlyHints }
}

const workspaceRoot = path.join(__dirname, '..', '..')
function stabilizePaths(str: string): string {
  str = str.replaceAll(workspaceRoot, '/$ROOT')
  return str
}
