import { expect, describe, it, beforeAll } from 'vitest'
import { renderPage } from '../../vite-plugin-ssr/node'
import { createServer } from 'vite'
import path from 'path'

beforeAll(async () => {
  await devApp()
}, 10 * 1000)

describe('preload tags', () => {
  it(
    'Preload Default',
    async () => {
      const { body, earlyHints } = await render('/')
      expect(earlyHints).toMatchInlineSnapshot(
        `
        [
          {
            "assetType": "script",
            "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
            "isEntry": true,
            "mediaType": "text/javascript",
            "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
          },
          {
            "assetType": "style",
            "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
            "isEntry": true,
            "mediaType": "text/css",
            "src": "/renderer/PageLayout.css?direct",
          },
        ]
      `
      )
      expect(body).toMatchInlineSnapshot(
        `
        "<!DOCTYPE html>
            <html>
              <head>
                <meta charset=\\"utf-8\\">
                <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\">
                <script type=\\"module\\" defer>
        import RefreshRuntime from \\"/@react-refresh\\"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
        import(\\"/@vite/client\\");
        import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
        </script>
                <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/index\\",\\"pageProps\\":\\"!undefined\\"}}</script>
              </head>
              <body>
                <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Default</h1><p>This page showcases the default preloading strategy: in production, both the image and the font are preloaded.</p></div></div></div>
              </body>
            </html>"
      `
      )
    },
    10 * 1000
  )
  it('Preload Disabled', async () => {
    const { body, earlyHints } = await render('/preload-disabled')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "script",
          "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
          "isEntry": true,
          "mediaType": "text/javascript",
          "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
        },
        {
          "assetType": "style",
          "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
          "isEntry": true,
          "mediaType": "text/css",
          "src": "/renderer/PageLayout.css?direct",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html>
            <head>
              <meta charset=\\"utf-8\\">
              <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\">
              <script type=\\"module\\" defer>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
      </script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-disabled\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Preload Disabled</h1><p>This page showcases completely disabled preloading: the image nor the font are preloaded.</p></div></div></div>
            </body>
          </html>"
    `
    )
  })
  it('Preload Images', async () => {
    const { body, earlyHints } = await render('/preload-images')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "script",
          "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
          "isEntry": true,
          "mediaType": "text/javascript",
          "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
        },
        {
          "assetType": "style",
          "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
          "isEntry": true,
          "mediaType": "text/css",
          "src": "/renderer/PageLayout.css?direct",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html>
            <head>
              <meta charset=\\"utf-8\\">
              <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\">
              <script type=\\"module\\" defer>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
      </script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-images\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Preload Images</h1><p>This page showcases a custom strategy of preloading images.</p></div></div></div>
            </body>
          </html>"
    `
    )
  })
  it('Preload Eager', async () => {
    const { body, earlyHints } = await render('/preload-eager')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "script",
          "earlyHintLink": "</@fs/$ROOT/vite-plugin-ssr/client/entry.ts>; rel=modulepreload; as=script",
          "isEntry": true,
          "mediaType": "text/javascript",
          "src": "/@fs/$ROOT/vite-plugin-ssr/client/entry.ts",
        },
        {
          "assetType": "style",
          "earlyHintLink": "</renderer/PageLayout.css?direct>; rel=preload; as=style",
          "isEntry": true,
          "mediaType": "text/css",
          "src": "/renderer/PageLayout.css?direct",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html>
            <head>
              <meta charset=\\"utf-8\\">
              <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/renderer/PageLayout.css?direct\\">
              <script type=\\"module\\" defer>
      import RefreshRuntime from \\"/@react-refresh\\"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
      import(\\"/@vite/client\\");
      import(\\"/@fs/$ROOT/vite-plugin-ssr/client/entry.ts\\");
      </script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-eager\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/renderer/logo.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Eager</h1><p>This page showcases eager preloading (non-JavaScript assets are preloaded ASAP).</p></div></div></div>
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

async function render(urlOriginal: '/' | '/preload-disabled' | '/preload-images' | '/preload-eager') {
  const { httpResponse } = await renderPage({ urlOriginal })
  const body = stabilizePaths(httpResponse!.body)
  const earlyHints = httpResponse!.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | boolean | string]) => {
        val = typeof val !== 'string' ? val : stabilizePaths(val)
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
