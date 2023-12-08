export { headings }

import type { HeadingDefinition } from '@brillout/docpress'

const headings = [
  {
    level: 1,
    title: 'Overview',
    titleEmoji: 'compass'
  },
  {
    level: 2,
    title: 'Introduction',
    titleDocument: 'Vike',
    url: '/'
  },
  {
    level: 2,
    title: 'Next.js Comparison',
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
    title: 'Vue Tour',
    url: '/vue-tour'
  },
  {
    level: 2,
    title: 'React Tour',
    url: '/react-tour'
  },
  {
    level: 2,
    title: 'Architecture',
    url: '/architecture',
    sectionTitles: ['`onRenderHtml()` & `onRenderClient()`', 'Do-one-thing-do-it-well']
  },
  {
    level: 1,
    title: 'Get Started',
    titleEmoji: 'seedling'
  },
  {
    level: 2,
    title: 'Scaffold new app',
    url: '/scaffold'
  },
  {
    level: 2,
    title: 'Add to existing app',
    url: '/add'
  },
  {
    level: 1,
    title: 'Guides',
    titleEmoji: 'books'
  },
  {
    level: 4,
    title: 'Basics'
  },
  {
    level: 2,
    title: 'Routing',
    url: '/routing'
  },
  {
    level: 2,
    title: 'Data Fetching',
    url: '/data-fetching',
    sectionTitles: ['`onBeforeRender()`', 'Error handling']
  },
  {
    level: 2,
    title: 'Pre-rendering (SSG)',
    url: '/pre-rendering'
  },
  {
    level: 2,
    title: 'Access `pageContext` anywhere',
    url: '/pageContext-anywhere'
  },
  {
    level: 2,
    title: 'Common Issues',
    url: '/common-issues'
  },
  {
    level: 4,
    title: 'More'
  },
  {
    level: 2,
    title: '`<head>` meta tags',
    url: '/head'
  },
  {
    level: 2,
    title: 'Authentication',
    url: '/auth',
    sectionTitles: ['Login flow']
  },
  {
    level: 2,
    title: 'Layouts',
    url: '/layouts'
  },
  {
    level: 2,
    title: 'Static Directory (`public/`)',
    url: '/static-directory'
  },
  {
    level: 2,
    title: 'Render Modes (SPA, SSR, SSG, HTML-only)',
    titleInNav: 'SPA, SSR, SSG, HTML-only',
    url: '/render-modes',
    sectionTitles: ['HTML-only', 'SPA', 'SSR']
  },
  {
    level: 2,
    title: 'Environment Variables',
    url: '/env'
  },
  {
    level: 2,
    title: 'Internationalization (i18n)',
    url: '/i18n'
  },
  {
    level: 2,
    title: 'File Structure',
    url: '/file-structure'
  },
  {
    level: 2,
    title: 'Paths Aliases',
    url: '/path-aliases'
  },
  {
    level: 2,
    title: 'Preload',
    url: '/preload'
  },
  {
    level: 2,
    title: 'HTML Streaming',
    url: '/stream'
  },
  {
    level: 2,
    title: 'API Routes',
    url: '/api-routes'
  },
  {
    level: 2,
    title: 'Client-only Components',
    url: '/client-only-components'
  },
  {
    level: 2,
    title: 'Error Handling',
    url: '/errors'
  },
  {
    level: 2,
    title: 'Debug',
    url: '/debug'
  },
  {
    level: 2,
    title: 'Build Your Own Framework',
    url: '/build-your-own-framework'
  },
  {
    level: 1,
    title: 'Routing',
    titleEmoji: 'road-fork'
  },
  {
    level: 2,
    title: 'Server Routing VS Client Routing',
    url: '/server-routing-vs-client-routing'
  },
  {
    level: 2,
    title: 'Filesystem Routing',
    url: '/filesystem-routing'
  },
  {
    level: 2,
    title: 'Route String',
    url: '/route-string'
  },
  {
    level: 2,
    title: 'Route Function',
    url: '/route-function'
  },
  {
    level: 2,
    title: 'Active Links',
    url: '/active-links'
  },
  {
    level: 2,
    title: 'Base URL',
    url: '/base-url'
  },
  {
    level: 2,
    title: 'Routing Precedence',
    url: '/routing-precedence'
  },
  {
    level: 1,
    title: 'Deploy',
    titleEmoji: 'earth'
  },
  {
    level: 4,
    title: 'Static hosts'
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
    titleInNav: 'Other',
    url: '/static-hosts'
  },
  {
    level: 4,
    title: 'Serverless'
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
    title: 'Full-stack'
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
    titleInNav: 'Other',
    url: '/deploy'
  },
  {
    level: 1,
    title: 'Integration',
    titleEmoji: 'plug'
  },
  {
    level: 4,
    title: 'Data fetching'
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
    titleInNav: 'Other',
    title: 'Data Fetching Tools',
    url: '/data-fetching-tools'
  },
  {
    level: 4,
    title: 'Data store'
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
    titleInNav: 'Other',
    url: '/store'
  },
  {
    level: 4,
    title: 'Authentication'
  },
  {
    level: 2,
    title: 'Auth.js',
    url: '/Auth.js'
  },
  {
    level: 4,
    title: 'CSS, styling, CSS frameworks'
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
    titleInNav: 'Other',
    title: 'CSS Frameworks',
    url: '/css-frameworks'
  },
  {
    level: 4,
    title: 'UI frameworks'
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
    titleInNav: 'Other',
    title: 'UI Framework',
    url: '/ui-framework'
  },
  {
    level: 4,
    title: 'Server'
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
    titleInNav: 'Other',
    url: '/server'
  },
  {
    level: 4,
    title: 'Other'
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
    titleInNav: 'Other',
    url: '/integration'
  },
  {
    level: 1,
    title: 'API',
    titleEmoji: 'gear'
  },
  {
    level: 4,
    title: 'Core'
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
    title: 'Config files',
    url: '/config'
  },
  {
    level: 2,
    title: 'Header file (`.h.js`)',
    url: '/header-file'
  },
  {
    level: 2,
    title: 'Error Page',
    url: '/error-page'
  },
  {
    level: 2,
    title: 'Client Entry',
    url: '/client'
  },
  {
    level: 4,
    title: 'Hooks'
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
    titleInNav: 'more...',
    url: '/hooks'
  },
  {
    level: 4,
    title: 'Utils (server- & client-side)'
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
    title: 'Utils (client-side)'
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
    title: 'Utils (server-side)'
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
    title: 'Settings'
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
    titleInNav: 'more...',
    url: '/settings'
  }
] satisfies HeadingDefinition[]
