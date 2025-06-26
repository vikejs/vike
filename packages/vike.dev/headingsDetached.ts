export { headingsDetached }
export { categories }
export type { HeadingsDetachedURL }

import type { Config, HeadingDetachedDefinition as HeadingDetachedDefinition_ } from '@brillout/docpress'

type CategoryName<C> = C extends { name: infer N extends string } ? N : C extends string ? C : never
type CategoryNames = CategoryName<(typeof categories)[number]>
type HeadingDetachedDefinition = Omit<HeadingDetachedDefinition_, 'category'> & {
  category: CategoryNames | 'Miscellaneous'
}

const categories = [
  'Guides',
  'API',
  'Glossary',

  'Deploy',
  'Integration',

  'Overview',
  'Get Started',

  'Guides (tools)',
  'Guides (more)',

  'Blog',
  'Migration',

  { name: 'Work-in-progress', hide: true },
  { name: 'Deprecated', hide: true },
] as const satisfies Config['categories']

type HeadingUrl<C> = C extends { url: infer N extends string } ? N : C extends string ? C : never
type HeadingsDetachedURL = HeadingUrl<(typeof headingsDetached)[number]>

const headingsDetached = [
  ...api(),
  ...guides(),
  ...tools(),
  ...migrations(),
  ...misc(),
  ...blog(),
  ...getStarted(),
  ...deprecated(),
  ...workInProgress(),
] satisfies HeadingDetachedDefinition[]

function tools() {
  return (
    [
      {
        title: 'Vue Query',
        url: '/vue-query',
      },
      {
        title: 'Vuex',
        url: '/vuex',
      },
      {
        title: 'PullState',
        url: '/pullstate',
      },
      {
        title: 'Panda CSS',
        url: '/panda-css',
      },
      {
        title: 'PM2',
        url: '/PM2',
      },
      {
        title: 'Koa',
        url: '/koa',
      },
      {
        title: 'hapi',
        url: '/hapi',
      },
      {
        title: 'HatTip',
        url: '/hattip',
      },
      {
        title: 'vue-i18n',
        url: '/vue-i18n',
      },
      {
        title: 'Windows Subsystem for Linux (WSL)',
        url: '/wsl',
      },
      {
        title: 'Redux',
        url: '/redux',
      },
      {
        title: 'Pinia',
        url: '/pinia',
      },
      {
        title: 'Effector',
        url: '/effector',
      },
      {
        title: 'Auth.js',
        url: '/Auth.js',
      },
      {
        title: 'Tailwind CSS',
        url: '/tailwind-css',
      },
      {
        title: 'daisyUI',
        url: '/daisyui',
      },
      {
        title: 'Compiled',
        url: '/compiled',
      },
      {
        title: 'Vuetify',
        url: '/vuetify',
      },
      {
        title: 'styled-components',
        url: '/styled-components',
      },
      {
        title: '`styled-jsx`',
        url: '/styled-jsx',
      },
      {
        title: 'MUI',
        url: '/mui',
      },
      {
        title: 'PrimeReact',
        url: '/primereact',
      },
      {
        title: 'NextUI',
        url: '/nextui',
      },
      {
        title: 'Bootstrap',
        url: '/bootstrap',
      },
      {
        title: 'Grommet',
        url: '/grommet',
      },
      {
        title: 'Mantine',
        url: '/mantine',
      },
      {
        title: 'Ant Design',
        url: '/antd',
      },
      {
        title: 'Sass / Less / Stylus',
        url: '/sass',
      },
      {
        title: 'Naive UI',
        url: '/naive-ui',
      },
      {
        title: 'Chakra UI',
        url: '/chakra',
      },
      {
        title: 'React',
        url: '/react',
        sectionTitles: ['React Server Components'],
      },
      {
        title: 'Vue',
        url: '/vue',
      },
      {
        title: 'Svelte',
        url: '/svelte',
      },
      {
        title: 'Preact',
        url: '/preact',
      },
      {
        title: 'Solid',
        url: '/solid',
      },
      {
        title: 'Angular',
        url: '/angular',
      },
      {
        title: 'VanJS',
        url: '/vanjs',
      },
      {
        title: 'Express.js',
        url: '/express',
      },
      {
        title: 'Hono',
        url: '/hono',
      },
      {
        title: 'Deno',
        url: '/deno',
      },
      {
        title: 'Fastify',
        url: '/fastify',
      },
      {
        title: 'Nitro',
        url: '/nitro',
      },
      {
        title: 'H3',
        url: '/h3',
      },
      {
        title: 'Ruby on Rails',
        url: '/ruby-on-rails',
      },
      {
        title: 'Firebase',
        url: '/firebase',
      },
      {
        title: 'Nginx',
        url: '/nginx',
      },
      {
        title: 'MDXEditor',
        url: '/MDXEditor',
      },
      {
        title: 'Tauri',
        url: '/tauri',
      },
      {
        title: 'Telefunc (RPC)',
        url: '/telefunc',
      },
      {
        title: 'tRPC',
        url: '/tRPC',
      },
      {
        title: 'TanStack Query',
        url: '/tanstack-query',
      },
      {
        title: 'Apollo (GraphQL)',
        url: '/apollo-graphql',
      },
      {
        title: 'Relay (GraphQL)',
        url: '/relay',
      },
      {
        title: 'urql (GraphQL)',
        url: '/urql',
      },
      {
        title: 'gRPC',
        url: '/grpc',
      },
      {
        title: 'Socket.IO',
        url: '/socket-io',
      },
      {
        title: 'Tool guides & examples',
        url: '/tools',
        sectionTitles: ['CSS-in-JS'],
      },
      {
        title: 'React Router',
        url: '/react-router',
      },
      {
        title: 'Vue Router',
        url: '/vue-router',
      },
      {
        title: 'TanStack Router',
        url: '/tanstack-router',
      },
      {
        title: 'Vitest',
        url: '/vitest',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Guides (tools)' as const })) satisfies HeadingDetachedDefinition[]
}

function misc() {
  return (
    [
      {
        title: "[Warning] Don't define global configs locally",
        url: '/warning/global-config',
      },
      {
        title: "[Warning] Don't load multiple versions",
        url: '/warning/version-mismatch',
      },
      {
        title: 'Consulting',
        url: '/consulting',
      },
      {
        title: 'UI Frameworks',
        url: '/ui-frameworks',
        category: 'Glossary',
      },
      {
        title: 'Banner',
        url: '/banner',
      },
      {
        title: 'Cover',
        url: '/banner/cover',
      },
      {
        title: 'RPC',
        url: '/RPC',
      },
      {
        title: 'Get a free license key',
        url: '/free',
        category: 'Overview',
      },
      {
        title: 'Buying a license key',
        url: '/buy',
        category: 'Overview',
      },
      {
        title: 'SPA',
        url: '/spa',
        category: 'Glossary',
      },
      {
        title: 'Use Cases',
        url: '/use-cases',
        category: 'Overview',
      },
      {
        title: 'Glossary',
        url: '/glossary',
      },
      {
        title: 'Languages',
        url: '/languages',
      },
      {
        title: 'Lazy Transpiling',
        url: '/lazy-transpiling',
        category: 'Glossary',
      },
      {
        title: 'Vike',
        url: '/vike',
      },
      {
        title: 'Press Kit',
        url: '/press',
      },
      {
        title: 'vike-react',
        url: '/vike-react',
        category: 'Overview',
      },
      {
        title: 'vike-vue',
        url: '/vike-vue',
        category: 'Overview',
      },
      {
        title: 'vike-solid',
        url: '/vike-solid',
        category: 'Overview',
      },
      {
        title: 'Versioning',
        url: '/versioning',
      },
      {
        title: 'Next.js Comparison',
        url: '/nextjs',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Miscellaneous' as const })) satisfies HeadingDetachedDefinition[]
}

function guides() {
  return (
    [
      {
        title: 'SPA vs SSR (and more)',
        url: '/SPA-vs-SSR',
      },
      {
        title: 'Content- VS interactive-centric',
        url: '/content-vs-interactive',
      },
      {
        title: 'Multiple `renderer/`',
        url: '/multiple-renderer',
      },
      {
        title: 'Manipulating `pageContext`',
        url: '/pageContext-manipulation',
      },
      { title: 'What is Hydration?', url: '/hydration' },
      {
        title: 'Client Routing',
        url: '/client-routing',
      },
      {
        title: 'Server Routing',
        url: '/server-routing',
      },
      {
        title: 'Build Your Own Framework',
        url: '/build-your-own-framework',
      },
      {
        title: 'Debug',
        url: '/debug',
      },
      {
        title: 'HTML Streaming',
        url: '/streaming',
      },
      {
        title: '`<head>` tags without `vike-{react,vue,solid}`',
        url: '/head-manual',
      },
      {
        title: 'Rule: `no-side-exports`',
        url: '/no-side-exports',
      },
      {
        title: 'Eject',
        url: '/eject',
      },
      {
        title: 'Hydration Mismatch',
        url: '/hydration-mismatch',
      },
      {
        title: 'Hints',
        url: '/hints',
      },
      {
        title: 'Broken npm package',
        url: '/broken-npm-package',
      },
      {
        title: 'Deployment synchronization',
        url: '/deploy-sync',
      },
      {
        title: '`process.env.NODE_ENV`',
        url: '/NODE_ENV',
      },
      {
        title: 'Client runtimes conflict',
        url: '/client-runtimes-conflict',
      },
      {
        title: 'Client runtime loaded twice',
        url: '/client-runtime-duplicated',
      },
      {
        title: 'CJS',
        url: '/CJS',
      },
      {
        title: 'URL Normalization',
        url: '/url-normalization',
      },
      {
        title: 'Abort',
        url: '/abort',
        sectionTitles: ['`throw redirect()` VS `throw render()` VS `navigate()`'],
      },
      {
        title: 'Image Optimizing',
        url: '/img',
      },
      {
        title: 'Server Routing VS Client Routing',
        url: '/server-routing-vs-client-routing',
      },
      {
        title: '`pageContext.json` requests',
        url: '/pageContext.json',
        sectionTitles: ['Avoid `pageContext.json` requests'],
      },
      {
        title: 'Vike extension VS custom integration',
        url: '/extension-vs-custom',
      },
      {
        title: 'Render Modes (SPA, SSR, SSG, HTML-only)',
        url: '/render-modes',
        sectionTitles: ['HTML-only', 'SPA', 'SSR'],
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Guides (more)' as const })) satisfies HeadingDetachedDefinition[]
}

function blog() {
  return (
    [
      {
        title: 'Introducing `globalContext`',
        url: '/blog/globalContext',
      },
      {
        title: 'Introducing `vike-server`',
        url: '/blog/vike-server',
      },
      {
        title: 'Vite 6 is a groundbreaking release',
        url: '/blog/vite-6',
      },
      {
        title: 'Releases',
        url: '/releases',
      },
      {
        title: 'Mai 2024 Releases',
        url: '/releases/2024-05',
      },
      {
        title: 'June Releases',
        url: '/releases/2024-06',
      },
      {
        title: 'July Releases',
        url: '/releases/2024-07',
      },
      {
        title: 'August Releases',
        url: '/releases/2024-08',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Blog' as const })) satisfies HeadingDetachedDefinition[]
}

function getStarted() {
  return (
    [
      {
        title: 'Scaffold new Vike app without Vike extension',
        url: '/new/core',
        pageDesign: {
          hideMenuLeft: true as const,
        },
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Get Started' as const })) satisfies HeadingDetachedDefinition[]
}

function api() {
  return (
    [
      {
        title: '`<Loading>`',
        url: '/Loading',
      },
      {
        title: '`favicon`',
        url: '/favicon',
      },
      {
        title: 'File Structure',
        url: '/file-structure',
      },
      {
        title: '`createDevMiddleware()`',
        url: '/createDevMiddleware',
      },
      {
        title: '`onRenderHtml()` hook',
        url: '/onRenderHtml',
      },
      {
        title: '`onRenderClient()` hook',
        url: '/onRenderClient',
      },
      {
        title: '`onBeforeRoute()` hook',
        url: '/onBeforeRoute',
      },
      {
        title: '`hydrationCanBeAborted`',
        url: '/hydrationCanBeAborted',
      },
      {
        title: '`extends`',
        url: '/extends',
      },
      {
        title: '`lang`',
        url: '/lang',
      },
      {
        title: '`onCreateApp()` hook',
        url: '/onCreateApp',
      },
      {
        title: '`+react`',
        url: '/react-setting',
      },
      {
        title: '`+host`',
        url: '/host',
      },
      {
        title: '`+port`',
        url: '/port',
      },
      {
        title: '`+mode`',
        url: '/mode',
      },
      {
        title: '`getPageContext()`',
        url: '/getPageContext',
      },
      {
        title: '`getPageContextClient()`',
        url: '/getPageContextClient',
      },
      {
        title: '`getVikeConfig()`',
        url: '/getVikeConfig',
      },
      {
        title: 'HTTP Headers',
        url: '/headers',
      },
      {
        title: '`reactStrictMode`',
        url: '/reactStrictMode',
      },
      {
        title: '`onPageTransitionEnd()` hook',
        url: '/onPageTransitionEnd',
      },
      {
        title: '`onBeforeRenderClient()` hook',
        url: '/onBeforeRenderClient',
      },
      {
        title: '`onAfterRenderClient()` hook',
        url: '/onAfterRenderClient',
      },
      {
        title: '`onBeforeRenderHtml()` hook',
        url: '/onBeforeRenderHtml',
      },
      {
        title: '`onAfterRenderHtml()` hook',
        url: '/onAfterRenderHtml',
      },
      {
        title: '`clientHooks`',
        url: '/clientHooks',
      },
      {
        title: '`require`',
        url: '/require',
      },
      {
        title: '`filesystemRoutingRoot`',
        url: '/filesystemRoutingRoot',
      },
      {
        title: '`bodyHtmlBegin`',
        url: '/bodyHtmlBegin',
      },
      {
        title: '`bodyHtmlEnd`',
        url: '/bodyHtmlEnd',
      },
      {
        title: '`injectScriptsAt`',
        url: '/injectScriptsAt',
      },
      { title: '`injectAssets()`', url: '/injectAssets' },
      {
        title: 'Vite Plugin',
        url: '/vite-plugin',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'API' as const })) satisfies HeadingDetachedDefinition[]
}

function workInProgress() {
  return (
    [
      {
        title: 'Getting started with Vike',
        url: '/start',
      },
      {
        title: 'Tour',
        url: '/tour',
      },
      {
        title: 'Vue Tour',
        url: '/vue-tour',
      },
      {
        title: 'React Tour',
        url: '/react-tour',
      },
      { title: 'Server-Side Rendering (SSR)', url: '/SSR' },
      {
        title: 'Server-side Rendering (SSR)',
        url: '/server-side-rendering',
      },
      { title: 'TypeScript', url: '/typescript' },
    ] as const
  ).map((h) => ({ ...h, category: 'Work-in-progress' as const })) satisfies HeadingDetachedDefinition[]
}

function deprecated() {
  return (
    [
      {
        title: '`createPageRenderer()`',
        url: '/createPageRenderer',
      },
      {
        title: 'Multiple `onBeforeRender()` hooks',
        url: '/onBeforeRender-multiple',
      },
      { title: '`dist/server/importBuild.js`', url: '/importBuild.js' },
      { title: '`importBuild.cjs`', url: '/importBuild.cjs' },
      {
        title: '`disableAutoFullBuild`',
        url: '/disableAutoFullBuild',
      },
      {
        title: 'Custom Exports/Hooks',
        url: '/exports',
      },
      {
        title: '`includeAssetsImportedByServer`',
        url: '/includeAssetsImportedByServer',
      },
      {
        title: '`throw RenderErrorPage()`',
        url: '/RenderErrorPage',
      },
      {
        title: '`doNotPrerender`',
        url: '/doNotPrerender',
      },
      {
        title: '`render()` hook (server-side)',
        url: '/render-hook',
      },
      {
        title: '`render()` hook (client-side)',
        url: '/render-client',
      },
      {
        title: '`.page.js`',
        url: '/.page.js',
      },
      {
        title: '`.page.server.js`',
        url: '/.page.server.js',
      },
      {
        title: '`.page.client.js`',
        url: '/.page.client.js',
      },
      {
        title: '`Page` (server-side)',
        url: '/Page-server',
      },
      {
        title: '`Page` (client-side)',
        url: '/Page-client',
      },
      {
        title: '`.page.route.js`',
        url: '/.page.route.js',
      },
      {
        title: '`_default.page.route.js`',
        url: '/_default.page.route.js',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Deprecated' as const })) satisfies HeadingDetachedDefinition[]
}

function migrations() {
  return (
    [
      {
        title: 'Migrate Vike settings',
        url: '/migration/settings',
      },
      {
        title: 'Migration `0.4.23`',
        url: '/migration/0.4.23',
      },
      {
        title: 'Migration `0.4`',
        url: '/migration/0.4',
      },
      {
        title: 'Migration from `0.4.x` to `1.0.0`',
        url: '/migration/v1',
      },
      {
        title: 'V1 Design Migration',
        url: '/migration/v1-design',
        sectionTitles: ['Custom hooks/exports'],
      },
      {
        title: 'Why the V1 design?',
        url: '/why-the-v1-design',
      },
      {
        title: 'Migrations',
        url: '/migration',
      },
      {
        title: 'CLI Migration',
        url: '/migration/cli',
      },
      {
        title: 'Migration `0.4.134`',
        url: '/migration/0.4.134',
      },
      {
        title: 'Migrate `vike-cloudflare`',
        url: '/migration/vike-cloudflare',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Migration' as const })) satisfies HeadingDetachedDefinition[]
}
