import { expect, describe, it, beforeAll } from 'vitest'
import { renderPage } from '../../vite-plugin-ssr/node'
import { build } from 'vite'
import { stabilizeHashs } from './utils/stabilizeHashs'

beforeAll(async () => {
  await buildApp()
}, 30 * 1000)

describe('preload tags', () => {
  it('Default preload strategy', async () => {
    const { body, earlyHints } = await render('/')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</assets/_default.page.client.$HASH.css>; rel=preload; as=style",
          "mediaType": "text/css",
          "src": "/assets/_default.page.client.$HASH.css",
        },
        {
          "assetType": "font",
          "earlyHintLink": "</assets/Sono-Light.$HASH.ttf>; rel=preload; as=font; crossorigin",
          "mediaType": "font/ttf",
          "src": "/assets/Sono-Light.$HASH.ttf",
        },
        {
          "assetType": "image",
          "earlyHintLink": "</assets/logo.$HASH.svg>; rel=preload; as=image",
          "mediaType": "image/svg+xml",
          "src": "/assets/logo.$HASH.svg",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entry-server-routing.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/entry-server-routing.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/pages/index.page.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/pages/index.page.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunk-$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/chunk-$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/renderer/_default.page.client.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/renderer/_default.page.client.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunk-$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/chunk-$HASH.js",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html><head><link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/assets/_default.page.client.$HASH.css\\"><link rel=\\"preload\\" href=\\"/assets/Sono-Light.$HASH.ttf\\" as=\\"font\\" type=\\"font/ttf\\" crossorigin></head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/assets/logo.$HASH.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-font-only\\">Preload Only Font</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Default</h1><p>This page showcases the default preloading strategy: in production, both the image and the font are preloaded.</p></div></div></div>
            <link rel=\\"preload\\" href=\\"/assets/logo.$HASH.svg\\" as=\\"image\\" type=\\"image/svg+xml\\"><script type=\\"module\\" src=\\"/assets/entry-server-routing.$HASH.js\\" async></script><link rel=\\"modulepreload\\" href=\\"/assets/entry-server-routing.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/pages/index.page.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/renderer/_default.page.client.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/index\\",\\"pageProps\\":\\"!undefined\\"}}</script></body>
          </html>"
    `
    )
  })
  it('Preload disabled', async () => {
    const { body, earlyHints } = await render('/preload-disabled')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</assets/_default.page.client.$HASH.css>; rel=preload; as=style",
          "mediaType": "text/css",
          "src": "/assets/_default.page.client.$HASH.css",
        },
        {
          "assetType": "font",
          "earlyHintLink": "</assets/Sono-Light.$HASH.ttf>; rel=preload; as=font; crossorigin",
          "mediaType": "font/ttf",
          "src": "/assets/Sono-Light.$HASH.ttf",
        },
        {
          "assetType": "image",
          "earlyHintLink": "</assets/logo.$HASH.svg>; rel=preload; as=image",
          "mediaType": "image/svg+xml",
          "src": "/assets/logo.$HASH.svg",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entry-server-routing.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/entry-server-routing.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/pages/preload-disabled.page.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/pages/preload-disabled.page.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunk-$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/chunk-$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/renderer/_default.page.client.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/renderer/_default.page.client.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunk-$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/chunk-$HASH.js",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html><head><link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/assets/_default.page.client.$HASH.css\\"></head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/assets/logo.$HASH.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-font-only\\">Preload Only Font</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Disabled</h1><p>This page showcases completely disabled preloading: the image nor the font are preloaded.</p></div></div></div>
            <script type=\\"module\\" src=\\"/assets/entry-server-routing.$HASH.js\\" async></script><link rel=\\"modulepreload\\" href=\\"/assets/entry-server-routing.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/pages/preload-disabled.page.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/renderer/_default.page.client.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-disabled\\",\\"pageProps\\":\\"!undefined\\"}}</script></body>
          </html>"
    `
    )
  })
  it('Preload only font', async () => {
    const { body, earlyHints } = await render('/preload-font-only')
    expect(earlyHints).toMatchInlineSnapshot(
      `
      [
        {
          "assetType": "style",
          "earlyHintLink": "</assets/_default.page.client.$HASH.css>; rel=preload; as=style",
          "mediaType": "text/css",
          "src": "/assets/_default.page.client.$HASH.css",
        },
        {
          "assetType": "font",
          "earlyHintLink": "</assets/Sono-Light.$HASH.ttf>; rel=preload; as=font; crossorigin",
          "mediaType": "font/ttf",
          "src": "/assets/Sono-Light.$HASH.ttf",
        },
        {
          "assetType": "image",
          "earlyHintLink": "</assets/logo.$HASH.svg>; rel=preload; as=image",
          "mediaType": "image/svg+xml",
          "src": "/assets/logo.$HASH.svg",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/entry-server-routing.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/entry-server-routing.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/pages/preload-font-only.page.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/pages/preload-font-only.page.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunk-$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/chunk-$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/renderer/_default.page.client.$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/renderer/_default.page.client.$HASH.js",
        },
        {
          "assetType": "script",
          "earlyHintLink": "</assets/chunk-$HASH.js>; rel=modulepreload; as=script",
          "mediaType": "text/javascript",
          "src": "/assets/chunk-$HASH.js",
        },
      ]
    `
    )
    expect(body).toMatchInlineSnapshot(
      `
      "<!DOCTYPE html>
          <html><head><link rel=\\"stylesheet\\" type=\\"text/css\\" href=\\"/assets/_default.page.client.$HASH.css\\"><link rel=\\"preload\\" href=\\"/assets/Sono-Light.$HASH.ttf\\" as=\\"font\\" type=\\"font/ttf\\" crossorigin></head>
            <body>
              <div id=\\"page-view\\"><div style=\\"display:flex;max-width:900px;margin:auto\\"><div style=\\"padding:20px;padding-top:20px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;line-height:1.8em\\"><div style=\\"margin-top:20px;margin-bottom:10px\\"><a href=\\"/\\"><img src=\\"/assets/logo.$HASH.svg\\" height=\\"64\\" width=\\"64\\"/></a></div><a class=\\"navitem\\" href=\\"/\\">Preload Default</a><a class=\\"navitem\\" href=\\"/preload-disabled\\">Preload Disabled</a><a class=\\"navitem\\" href=\\"/preload-font-only\\">Preload Only Font</a></div><div style=\\"padding:20px;padding-bottom:50px;border-left:2px solid #eee;min-height:100vh\\"><h1>Font Only</h1><p>This page showcases a custom strategy of only preloading the font (i.e. the image isn&#x27;t preloaded).</p></div></div></div>
            <script type=\\"module\\" src=\\"/assets/entry-server-routing.$HASH.js\\" async></script><link rel=\\"modulepreload\\" href=\\"/assets/entry-server-routing.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/pages/preload-font-only.page.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/renderer/_default.page.client.$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><link rel=\\"modulepreload\\" href=\\"/assets/chunk-$HASH.js\\" as=\\"script\\" type=\\"text/javascript\\"><script id=\\"vite-plugin-ssr_pageContext\\" type=\\"application/json\\">{\\"pageContext\\":{\\"_pageId\\":\\"/pages/preload-font-only\\",\\"pageProps\\":\\"!undefined\\"}}</script></body>
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

async function render(urlOriginal: '/' | '/preload-disabled' | '/preload-font-only') {
  const { httpResponse } = await renderPage({ urlOriginal })
  const body = stabilizeHashs(httpResponse!.body)
  const earlyHints = httpResponse!.earlyHints.map((hint) =>
    Object.fromEntries(
      Object.entries(hint).map(([key, val]: [string, null | string]) => {
        val = val && stabilizeHashs(val)
        return [key, val]
      })
    )
  )
  return { body, earlyHints }
}
