import { expect, describe, it, beforeAll } from 'vitest'
import { renderPage } from '../../vite-plugin-ssr/node/runtime'
import { build } from 'vite'
import { stabilizeHashs } from './utils/stabilizeHashs'

beforeAll(async () => {
  await buildApp()
}, 40 * 1000)

describe('preload tags', () => {
  it('Preload Default', async () => {
    const { body, earlyHints } = await render('/')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</assets/static/default.page.client.$HASH.css>; rel=preload; as=style",
          "isEntry": true,
          "mediaType": "text/css",
          "src": "/assets/static/default.page.client.$HASH.css",
        },
        {
          "assetType": "font",
          "earlyHintLink": "</assets/static/Sono-Light.$HASH.ttf>; rel=preload; as=font",
          "isEntry": false,
          "mediaType": "font/ttf",
          "src": "/assets/static/Sono-Light.$HASH.ttf",
        },
        {
          "assetType": "image",
          "earlyHintLink": "</assets/static/logo.$HASH.svg>; rel=preload; as=image",
          "isEntry": false,
          "mediaType": "image/svg+xml",
          "src": "/assets/static/logo.$HASH.svg",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/entry-server-routing.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": true,
          "mediaType": "text/javascript",
          "src": "/assets/entries/entry-server-routing.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/pages_index.page.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/pages_index.page.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/renderer_default.page.client.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/renderer_default.page.client.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html>
            <head>
              <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/assets/static/default.page.client.$HASH.css\\">
              <link rel=\\"preload\\" href=\\"/assets/static/Sono-Light.$HASH.ttf\\" as=\\"font\\" type=\\"font/ttf\\" crossorigin>
            </head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/assets/static/logo.$HASH.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Default</h1><p>This page showcases the default preloading strategy: in production, both the image and the font are preloaded.</p></div></div></div>
              <script type=\\"module\\" src=\\"/assets/entries/entry-server-routing.$HASH.js\\" defer></script>
              <link rel=\\"modulepreload\\" href=\\"/assets/entries/pages_index.page.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/chunks/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/entries/renderer_default.page.client.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/chunks/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/index\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </body>
          </html>"
    `
    )
  })
  it('Preload Disabled', async () => {
    const { body, earlyHints } = await render('/preload-disabled')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</assets/static/default.page.client.$HASH.css>; rel=preload; as=style",
          "isEntry": true,
          "mediaType": "text/css",
          "src": "/assets/static/default.page.client.$HASH.css",
        },
        {
          "assetType": "font",
          "earlyHintLink": "</assets/static/Sono-Light.$HASH.ttf>; rel=preload; as=font",
          "isEntry": false,
          "mediaType": "font/ttf",
          "src": "/assets/static/Sono-Light.$HASH.ttf",
        },
        {
          "assetType": "image",
          "earlyHintLink": "</assets/static/logo.$HASH.svg>; rel=preload; as=image",
          "isEntry": false,
          "mediaType": "image/svg+xml",
          "src": "/assets/static/logo.$HASH.svg",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/entry-server-routing.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": true,
          "mediaType": "text/javascript",
          "src": "/assets/entries/entry-server-routing.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/pages_preload-disabled.page.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/pages_preload-disabled.page.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/renderer_default.page.client.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/renderer_default.page.client.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html>
            <head>
              <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/assets/static/default.page.client.$HASH.css\\">
            </head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/assets/static/logo.$HASH.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Preload Disabled</h1><p>This page showcases completely disabled preloading: the image nor the font are preloaded.</p></div></div></div>
              <script type=\\"module\\" src=\\"/assets/entries/entry-server-routing.$HASH.js\\" defer></script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-disabled\\",\\"pageProps\\":\\"!undefined\\"}}</script>
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
          "assetType": "style",
          "earlyHintLink": "</assets/static/default.page.client.$HASH.css>; rel=preload; as=style",
          "isEntry": true,
          "mediaType": "text/css",
          "src": "/assets/static/default.page.client.$HASH.css",
        },
        {
          "assetType": "font",
          "earlyHintLink": "</assets/static/Sono-Light.$HASH.ttf>; rel=preload; as=font",
          "isEntry": false,
          "mediaType": "font/ttf",
          "src": "/assets/static/Sono-Light.$HASH.ttf",
        },
        {
          "assetType": "image",
          "earlyHintLink": "</assets/static/logo.$HASH.svg>; rel=preload; as=image",
          "isEntry": false,
          "mediaType": "image/svg+xml",
          "src": "/assets/static/logo.$HASH.svg",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/entry-server-routing.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": true,
          "mediaType": "text/javascript",
          "src": "/assets/entries/entry-server-routing.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/pages_preload-images.page.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/pages_preload-images.page.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/renderer_default.page.client.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/renderer_default.page.client.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html>
            <head>
              <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/assets/static/default.page.client.$HASH.css\\">
              <link rel=\\"preload\\" href=\\"/assets/static/Sono-Light.$HASH.ttf\\" as=\\"font\\" type=\\"font/ttf\\" crossorigin>
              <link rel=\\"preload\\" href=\\"/assets/static/logo.$HASH.svg\\" as=\\"image\\" type=\\"image/svg+xml\\">
            </head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/assets/static/logo.$HASH.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Preload Images</h1><p>This page showcases a custom strategy of preloading images.</p></div></div></div>
              <script type=\\"module\\" src=\\"/assets/entries/entry-server-routing.$HASH.js\\" defer></script>
              <link rel=\\"modulepreload\\" href=\\"/assets/entries/pages_preload-images.page.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/chunks/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/entries/renderer_default.page.client.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/chunks/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-images\\",\\"pageProps\\":\\"!undefined\\"}}</script>
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
          "assetType": "style",
          "earlyHintLink": "</assets/static/default.page.client.$HASH.css>; rel=preload; as=style",
          "isEntry": true,
          "mediaType": "text/css",
          "src": "/assets/static/default.page.client.$HASH.css",
        },
        {
          "assetType": "font",
          "earlyHintLink": "</assets/static/Sono-Light.$HASH.ttf>; rel=preload; as=font",
          "isEntry": false,
          "mediaType": "font/ttf",
          "src": "/assets/static/Sono-Light.$HASH.ttf",
        },
        {
          "assetType": "image",
          "earlyHintLink": "</assets/static/logo.$HASH.svg>; rel=preload; as=image",
          "isEntry": false,
          "mediaType": "image/svg+xml",
          "src": "/assets/static/logo.$HASH.svg",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/entry-server-routing.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": true,
          "mediaType": "text/javascript",
          "src": "/assets/entries/entry-server-routing.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/pages_preload-eager.page.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/pages_preload-eager.page.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entries/renderer_default.page.client.$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/entries/renderer_default.page.client.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunks/chunk-$HASH.js>; rel=modulepreload; as=script",
          "isEntry": false,
          "mediaType": "text/javascript",
          "src": "/assets/chunks/chunk-$HASH.js",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html>
            <head>
              <link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/assets/static/default.page.client.$HASH.css\\">
              <link rel=\\"preload\\" href=\\"/assets/static/Sono-Light.$HASH.ttf\\" as=\\"font\\" type=\\"font/ttf\\" crossorigin>
              <link rel=\\"preload\\" href=\\"/assets/static/logo.$HASH.svg\\" as=\\"image\\" type=\\"image/svg+xml\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/entries/pages_preload-eager.page.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/chunks/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/entries/renderer_default.page.client.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
              <link rel=\\"modulepreload\\" href=\\"/assets/chunks/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\">
            </head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/assets/static/logo.$HASH.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-images\\">Preload Images</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Eager</h1><p>This page showcases eager preloading (non-JavaScript assets are preloaded ASAP).</p></div></div></div>
              <script type=\\"module\\" src=\\"/assets/entries/entry-server-routing.$HASH.js\\" defer></script>
              <script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-eager\\",\\"pageProps\\":\\"!undefined\\"}}</script>
            </body>
          </html>"
    `
    )
  })
})

async function buildApp() {
  const inlineConfig = {
    logLevel: 'warn' as const,
    root: __dirname,
    configFile: __dirname + '/vite.config.js'
  }
  await build(inlineConfig)
  await build({
    build: { ssr: true },
    ...inlineConfig
  })
}

async function render(urlOriginal: '/' | '/preload-disabled' | '/preload-images' | '/preload-eager') {
  const { httpResponse } = await renderPage({ urlOriginal })
  const body = stabilizeHashs(httpResponse!.body)
  const earlyHints = httpResponse!.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | boolean | string]) => {
        val = typeof val !== 'string' ? val : stabilizeHashs(val)
        return [key, val]
      })
    )
  )
  return { body, earlyHints }
}
