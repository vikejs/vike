export { headings }

import type { HeadingDefinition } from '@brillout/docpress'

const headings = [
  {
    level: 1,
    title: '概要',
    titleEmoji: 'compass'
  },
  {
    level: 2,
    title: 'Vikeについて',
    titleDocument: 'Vike',
    url: '/'
  },
  {
    level: 2,
    title: 'Next.jsとの比較',
    url: '/nextjs-comparison'
  },
  /*
  {
    level: 2,
    title: 'What is Server-side Rendering (SSR)?',
    url: '/ssr',
  },
  */
  {
    level: 2,
    title: 'Vue ツアー',
    url: '/vue-tour'
  },
  {
    level: 2,
    title: 'React ツアー',
    url: '/react-tour'
  },
  {
    level: 2,
    title: 'アーキテクチャ',
    url: '/architecture',
    sectionTitles: ['`onRenderHtml()` & `onRenderClient()`', 'Do-one-thing-do-it-well']
  },
  {
    level: 1,
    title: '導入方法',
    titleEmoji: 'seedling'
  },
  {
    level: 2,
    title: '新規でアプリケーションに導入',
    url: '/scaffold'
  },
  {
    level: 2,
    title: '既存アプリケーションに導入',
    url: '/add'
  },
  {
    level: 1,
    title: 'ガイド',
    titleEmoji: 'books'
  },
  {
    level: 4,
    title: '基本'
  },
  {
    level: 2,
    title: 'ルーティング',
    url: '/routing'
  },
  {
    level: 2,
    title: 'データフェッチ',
    url: '/data-fetching',
    sectionTitles: ['`onBeforeRender()`', 'Error handling']
  },
  {
    level: 2,
    title: 'プリレンダリング (SSG)',
    url: '/pre-rendering'
  },
  {
    level: 2,
    title: 'どこからでも `pageContext` にアクセス',
    url: '/pageContext-anywhere'
  },
  {
    level: 2,
    title: 'よくある課題',
    url: '/common-issues'
  },
  {
    level: 4,
    title: '詳細'
  },
  {
    level: 2,
    title: '`<head>` メタタグ',
    url: '/head'
  },
  {
    level: 2,
    title: '認証',
    url: '/auth',
    sectionTitles: ['Login flow']
  },
  {
    level: 2,
    title: 'レイアウト',
    url: '/layouts'
  },
  {
    level: 2,
    title: '静的ディレクトリ (`public/`)',
    url: '/static-directory'
  },
  {
    level: 2,
    title: 'レンダーモード (SPA, SSR, SSG, HTML-only)',
    titleInNav: 'SPA, SSR, SSG, HTML-only',
    url: '/render-modes',
    sectionTitles: ['HTML-only', 'SPA', 'SSR']
  },
  {
    level: 2,
    title: '環境変数',
    url: '/env'
  },
  {
    level: 2,
    title: '国際化対応 (i18n)',
    url: '/i18n'
  },
  {
    level: 2,
    title: 'ファイル構成',
    url: '/file-structure'
  },
  {
    level: 2,
    title: 'パスのエイリアス',
    url: '/path-aliases'
  },
  {
    level: 2,
    title: 'プリロード',
    url: '/preload'
  },
  {
    level: 2,
    title: 'HTMLストリーミング',
    url: '/stream'
  },
  {
    level: 2,
    title: 'APIルート',
    url: '/api-routes'
  },
  {
    level: 2,
    title: 'Client-onlyコンポーネント',
    url: '/client-only-components'
  },
  {
    level: 2,
    title: 'エラーハンドリング',
    url: '/errors'
  },
  {
    level: 2,
    title: 'デバッグ',
    url: '/debug'
  },
  {
    level: 2,
    title: '独自のフレームワークを構築',
    url: '/build-your-own-framework'
  },
  {
    level: 1,
    title: 'ルーティング',
    titleEmoji: 'road-fork'
  },
  {
    level: 2,
    title: 'サーバー vs クライアント',
    url: '/server-routing-vs-client-routing'
  },
  {
    level: 2,
    title: 'ファイルシステム ルーティング',
    url: '/filesystem-routing'
  },
  {
    level: 2,
    title: 'ルート文字列',
    url: '/route-string'
  },
  {
    level: 2,
    title: 'ルート関数',
    url: '/route-function'
  },
  {
    level: 2,
    title: 'アクティブリンク',
    url: '/active-links'
  },
  {
    level: 2,
    title: 'ベースURL',
    url: '/base-url'
  },
  {
    level: 2,
    title: 'ルーティングの優先順位',
    url: '/routing-precedence'
  },
  {
    level: 1,
    title: 'デプロイ',
    titleEmoji: 'earth'
  },
  {
    level: 4,
    title: '静的ホスト'
  },
  {
    level: 2,
    title: 'GitHub Pages',
    url: '/github-pages'
  },
  {
    level: 2,
    title: 'Cloudflare Pages',
    url: '/cloudflare-pages'
  },
  {
    level: 2,
    title: 'Netlify',
    url: '/netlify'
  },
  {
    level: 2,
    title: 'Static Hosts',
    titleInNav: 'その他',
    url: '/static-hosts'
  },
  {
    level: 4,
    title: 'サーバーレス'
  },
  {
    level: 2,
    title: 'Cloudflare Workers',
    url: '/cloudflare-workers',
    sectionTitles: ['Cloudflare Pages']
  },
  {
    level: 2,
    title: 'Vercel',
    url: '/vercel'
  },
  {
    level: 2,
    title: 'AWS Lambda',
    url: '/aws-lambda'
  },
  {
    level: 2,
    title: 'Netlify Functions',
    url: '/netlify-functions'
  },
  {
    level: 4,
    title: 'フルスタック'
  },
  {
    level: 2,
    title: 'AWS',
    url: '/aws'
  },
  {
    level: 2,
    title: 'Docker',
    url: '/docker'
  },
  {
    level: 2,
    title: 'Deploy',
    titleInNav: 'その他',
    url: '/deploy'
  },
  {
    level: 1,
    title: 'インテグレーション',
    titleEmoji: 'plug'
  },
  {
    level: 4,
    title: 'データフェッチ'
  },
  {
    level: 2,
    title: 'Apollo (GraphQL)',
    url: '/apollo-graphql'
  },
  {
    level: 2,
    title: 'Relay (GraphQL)',
    url: '/relay'
  },
  {
    level: 2,
    titleInNav: 'Telefunc (RPC)',
    title: 'Telefunc',
    url: '/telefunc'
  },
  {
    level: 2,
    title: 'tRPC',
    url: '/tRPC'
  },
  {
    level: 2,
    title: 'React Query',
    url: '/react-query'
  },
  {
    level: 2,
    title: 'Vue Query',
    url: '/vue-query'
  },
  {
    level: 2,
    title: 'urql (GraphQL)',
    url: '/urql'
  },
  {
    level: 2,
    title: 'gRPC',
    url: '/grpc'
  },
  {
    level: 2,
    title: 'Socket.IO',
    url: '/socket-io'
  },
  {
    level: 2,
    titleInNav: 'その他',
    title: 'Data Fetching Tools',
    url: '/data-fetching-tools'
  },
  {
    level: 4,
    title: 'データストア'
  },
  {
    level: 2,
    title: 'Vuex',
    url: '/vuex'
  },
  {
    level: 2,
    title: 'Redux',
    url: '/redux'
  },
  {
    level: 2,
    title: 'Pinia',
    url: '/pinia'
  },
  {
    level: 2,
    title: 'PullState',
    url: '/pullstate'
  },
  {
    level: 2,
    title: 'Data Store',
    titleInNav: 'その他',
    url: '/store'
  },
  {
    level: 4,
    title: '認証'
  },
  {
    level: 2,
    title: 'Auth.js',
    url: '/Auth.js'
  },
  {
    level: 4,
    title: 'CSS・スタイリング・CSSフレームワーク'
  },
  {
    level: 2,
    title: 'Tailwind CSS',
    url: '/tailwind-css'
  },
  {
    level: 2,
    title: 'daisyUI',
    url: '/daisyui'
  },
  {
    level: 2,
    title: 'Windi CSS',
    url: '/windi-css'
  },
  {
    level: 2,
    title: 'Vuetify',
    url: '/vuetify'
  },
  {
    level: 2,
    title: 'CSS-in-JS',
    url: '/css-in-js'
  },
  {
    level: 2,
    title: '`styled-components`',
    titleInNav: 'styled-components',
    url: '/styled-components'
  },
  {
    level: 2,
    title: '`styled-jsx`',
    titleInNav: 'styled-jsx',
    url: '/styled-jsx'
  },
  {
    level: 2,
    title: 'MUI',
    url: '/mui'
  },
  {
    level: 2,
    title: 'PrimeReact',
    url: '/primereact'
  },
  {
    level: 2,
    title: 'Bootstrap',
    url: '/bootstrap'
  },
  {
    level: 2,
    title: 'Grommet',
    url: '/grommet'
  },
  {
    level: 2,
    title: 'Mantine',
    url: '/mantine'
  },
  {
    level: 2,
    title: 'Sass / Less / Stylus',
    url: '/sass'
  },
  {
    level: 2,
    titleInNav: 'その他',
    title: 'CSS Frameworks',
    url: '/css-frameworks'
  },
  {
    level: 4,
    title: 'UIフレームワーク'
  },
  {
    level: 2,
    title: 'React',
    url: '/react',
    sectionTitles: ['React Server Components']
  },
  {
    level: 2,
    title: 'Vue',
    url: '/vue'
  },
  {
    level: 2,
    title: 'Svelte',
    url: '/svelte'
  },
  {
    level: 2,
    title: 'Preact',
    url: '/preact'
  },
  {
    level: 2,
    title: 'Solid',
    url: '/solid'
  },
  {
    level: 2,
    title: 'Angular',
    url: '/angular'
  },
  {
    level: 2,
    titleInNav: 'その他',
    title: 'UI Framework',
    url: '/ui-framework'
  },
  {
    level: 4,
    title: 'サーバー'
  },
  {
    level: 2,
    title: 'HTTPS',
    url: '/https'
  },
  {
    level: 2,
    title: 'Express.js',
    url: '/express'
  },
  {
    level: 2,
    title: 'Deno',
    url: '/deno'
  },
  {
    level: 2,
    title: 'Fastify',
    url: '/fastify'
  },
  {
    level: 2,
    title: 'Firebase',
    url: '/firebase'
  },
  {
    level: 2,
    title: 'Ruby on Rails',
    url: '/ruby-on-rails'
  },
  {
    level: 2,
    title: 'PM2',
    url: '/PM2'
  },
  {
    level: 2,
    title: 'Koa',
    url: '/koa'
  },
  {
    level: 2,
    title: 'hapi',
    url: '/hapi'
  },
  {
    level: 2,
    title: 'H3',
    url: '/h3'
  },
  {
    level: 2,
    title: 'HatTip',
    url: '/hattip'
  },
  {
    level: 2,
    title: 'Server Integration',
    titleInNav: 'その他',
    url: '/server'
  },
  {
    level: 4,
    title: 'その他'
  },
  {
    level: 2,
    title: 'Markdown',
    url: '/markdown'
  },
  {
    level: 2,
    title: 'MDXEditor',
    url: '/MDXEditor'
  },
  {
    level: 2,
    title: 'Tauri',
    url: '/tauri'
  },
  {
    level: 2,
    title: 'Other Integrations',
    titleInNav: 'その他',
    url: '/integration'
  },
  {
    level: 1,
    title: 'API',
    titleEmoji: 'gear'
  },
  {
    level: 4,
    title: 'コア'
  },
  {
    level: 2,
    title: '`pageContext`',
    url: '/pageContext'
  },
  {
    level: 2,
    title: '`Page`',
    url: '/Page'
  },
  {
    level: 2,
    title: '`route`',
    url: '/route'
  },
  {
    level: 2,
    title: 'Configファイル',
    url: '/config'
  },
  {
    level: 2,
    title: 'ヘッダーファイル (`.h.js`)',
    url: '/header-file'
  },
  {
    level: 2,
    title: 'エラーページ',
    url: '/error-page'
  },
  {
    level: 2,
    title: 'クライアントエントリ',
    url: '/client'
  },
  {
    level: 4,
    title: 'フック'
  },
  {
    level: 2,
    title: '`guard()` hook',
    titleInNav: '`guard()`',
    url: '/guard'
  },
  {
    level: 2,
    title: '`onBeforeRender()` hook',
    titleInNav: '`onBeforeRender()`',
    url: '/onBeforeRender'
  },
  {
    level: 2,
    title: '`onHydrationEnd()` hook',
    titleInNav: '`onHydrationEnd()`',
    url: '/onHydrationEnd'
  },
  {
    level: 2,
    title: '`onPageTransitionStart()` hook',
    titleInNav: '`onPageTransitionStart()`',
    url: '/onPageTransitionStart'
  },
  {
    level: 2,
    title: '`onPageTransitionEnd()` hook',
    titleInNav: '`onPageTransitionEnd()`',
    url: '/onPageTransitionEnd'
  },
  {
    level: 2,
    title: '`onBeforePrerenderStart()` hook',
    titleInNav: '`onBeforePrerenderStart()`',
    url: '/onBeforePrerenderStart'
  },
  {
    level: 2,
    title: '`onPrerenderStart()` hook',
    titleInNav: '`onPrerenderStart()`',
    url: '/onPrerenderStart'
  },
  {
    level: 2,
    title: 'Hooks',
    titleInNav: 'もっと見る',
    url: '/hooks'
  },
  {
    level: 4,
    title: 'ユーティリティ (サーバー & クライアントサイド)'
  },
  {
    level: 2,
    title: '`usePageContext()`',
    url: '/usePageContext'
  },
  {
    level: 2,
    title: '`ClientOnly`',
    url: '/ClientOnly'
  },
  {
    level: 2,
    title: '`throw redirect()`',
    url: '/redirect'
  },
  {
    level: 2,
    title: '`throw render()`',
    url: '/render'
  },
  {
    level: 4,
    title: 'ユーティリティ (クライアントサイド)'
  },
  {
    level: 2,
    title: '`navigate()`',
    url: '/navigate'
  },
  {
    level: 2,
    title: '`reload()`',
    url: '/reload'
  },
  {
    level: 2,
    title: '`prefetch()`',
    url: '/prefetch'
  },
  {
    level: 4,
    title: 'ユーティリティ (サーバーサイド)'
  },
  {
    level: 2,
    title: '`renderPage()`',
    url: '/renderPage'
  },
  {
    level: 2,
    title: '`escapeInject`',
    url: '/escapeInject'
  },
  {
    level: 2,
    title: '`injectFilter()`',
    url: '/injectFilter'
  },
  {
    level: 2,
    title: '`prerender()`',
    url: '/prerender-programmatic'
  },
  {
    level: 4,
    title: '設定'
  },
  {
    level: 2,
    title: '`prerender`',
    url: '/prerender-config'
  },
  {
    level: 2,
    title: '`redirects`',
    url: '/redirects'
  },
  {
    level: 2,
    title: '`prefetchStaticAssets`',
    url: '/prefetchStaticAssets'
  },
  {
    level: 2,
    title: '`hooksTimeout`',
    url: '/hooksTimeout'
  },
  {
    level: 2,
    title: '`filesystemRoutingRoot`',
    url: '/filesystemRoutingRoot'
  },
  {
    level: 2,
    title: '`passToClient`',
    url: '/passToClient'
  },
  {
    level: 2,
    title: '`clientRouting`',
    url: '/clientRouting'
  },
  {
    level: 2,
    title: '`meta`',
    url: '/meta',
    sectionTitles: [
      'Example: `dataEndpointUrl`',
      'Example: `sql`',
      'Example: `title` and `description`',
      'Example: `Layout`',
      'Example: modify `onBeforeRender()` env'
    ]
  },
  {
    level: 2,
    title: 'Settings',
    titleInNav: 'もっと見る',
    url: '/settings'
  }
] satisfies HeadingDefinition[]
