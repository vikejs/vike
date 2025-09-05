export { headings }
export { headingsDetached }
export { categories }
export type { HeadingsURL }

import {
  iconScroll,
  iconCompass,
  iconGear,
  type HeadingDefinition,
  iconSeedling,
  iconGlobe,
  iconPlug,
} from '@brillout/docpress'
import type { Config, HeadingDetachedDefinition as HeadingDetachedDefinition_ } from '@brillout/docpress'
type HeadingDetachedDefinition = Omit<HeadingDetachedDefinition_, 'category'> & {
  category: CategoryNames | 'Miscellaneous'
}

type ExtractHeadingUrl<C> = C extends { url: infer N extends string } ? N : C extends string ? C : never
type HeadingsURL = ExtractHeadingUrl<(typeof headings)[number]> | ExtractHeadingUrl<(typeof headingsDetached)[number]>
type ExtractCategoryName<C> = C extends { name: infer N extends string } ? N : C extends string ? C : never
type CategoryNames = ExtractCategoryName<(typeof categories)[number]>

const categories = [
  'Guides',
  'API',
  'Glossary',
  'Deploy',
  'Extensions',
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

const headings = [
  {
    level: 1,
    title: 'Overview',
    titleIcon: iconCompass,
    color: '#e1a524',
  },
  {
    level: 2,
    title: 'Introduction',
    titleDocument: 'Vike',
    url: '/',
  },
  {
    level: 2,
    title: 'FAQ',
    url: '/faq',
  },
  {
    level: 2,
    title: 'Why Vike',
    url: '/why',
  },
  {
    level: 2,
    title: 'Open Source Pricing',
    url: '/pricing',
  },
  {
    level: 2,
    title: 'Extensions',
    url: '/extensions',
  },
  /*
  {
    level: 2,
    title: 'Next.js Comparison',
    url: '/nextjs'
  },
  */
  {
    level: 2,
    title: 'Team',
    url: '/team',
  },
  {
    level: 1,
    title: 'Get Started',
    titleIcon: iconSeedling,
    color: '#74d717',
  },
  /*
  {
    level: 2,
    title: 'Getting started with Vike',
    url: '/start'
  },
  */
  {
    level: 2,
    title: 'Scaffold new Vike app',
    pageDesign: {
      hideTitle: true,
      hideMenuLeft: true,
      contentMaxWidth: 1200,
    },
    url: '/new',
  },
  {
    level: 2,
    title: 'Add SSR/SSG to existing Vite app',
    url: '/add',
    pageDesign: {
      hideMenuLeft: true,
    },
  },
  {
    level: 1,
    title: 'Guides',
    titleIcon: iconScroll,
    color: '#ffd511',
  },
  {
    level: 4,
    title: 'Basics',
  },
  {
    level: 2,
    title: 'Data Fetching',
    url: '/data-fetching',
    sectionTitles: ['Pre-rendering (SSG)'],
  },
  {
    level: 2,
    title: 'Pre-rendering (SSG)',
    url: '/pre-rendering',
    sectionTitles: ['SPA'],
  },
  {
    level: 2,
    title: 'SSR vs SPA',
    url: '/SSR-vs-SPA',
  },
  {
    level: 2,
    title: '`<head>` tags',
    url: '/head-tags',
  },
  {
    level: 2,
    title: 'Common Issues',
    url: '/common-issues',
  },
  {
    level: 4,
    title: 'Routing',
  },
  {
    level: 2,
    title: 'Routing',
    url: '/routing',
    sectionTitles: ['Filesystem Routing', '`src/`'],
  },
  {
    level: 2,
    title: 'Base URL',
    url: '/base-url',
  },
  {
    level: 2,
    title: 'Active Links',
    url: '/active-links',
  },
  {
    level: 4,
    title: 'More',
  },
  {
    level: 2,
    title: 'Static Directory (`public/`)',
    url: '/static-directory',
  },
  {
    level: 2,
    title: '`.server.js` / `.client.js` / `.shared.js`',
    titleInNav: '`.server.js`/`.client.js`/`.shared.js`',
    url: '/file-env',
  },
  {
    level: 2,
    title: 'Environment Variables',
    url: '/env',
  },
  {
    level: 2,
    title: 'HTTP Headers',
    url: '/headers',
  },
  {
    level: 2,
    title: 'Internationalization (i18n)',
    url: '/i18n',
  },
  {
    level: 2,
    title: 'Paths Aliases',
    url: '/path-aliases',
  },
  {
    level: 2,
    title: 'Preloading',
    url: '/preloading',
  },
  {
    level: 2,
    title: 'API Routes',
    url: '/api-routes',
  },
  {
    level: 1,
    title: 'Deploy',
    titleIcon: iconGlobe,
    color: '#2d81f1',
  },
  {
    level: 4,
    title: 'Static hosts',
  },
  {
    level: 2,
    title: 'GitHub Pages',
    url: '/github-pages',
  },
  {
    level: 2,
    title: 'Netlify',
    url: '/netlify',
  },
  {
    level: 2,
    title: 'Cloudflare Pages',
    url: '/cloudflare-pages',
  },
  {
    level: 2,
    title: 'Static Hosts',
    titleInNav: '... more',
    url: '/static-hosts',
  },
  {
    level: 4,
    title: 'Serverless',
  },
  {
    level: 2,
    title: 'Cloudflare',
    url: '/cloudflare',
    sectionTitles: ['Cloudflare Pages'],
  },
  {
    level: 2,
    title: 'Vercel',
    url: '/vercel',
  },
  {
    level: 2,
    title: 'AWS Lambda',
    url: '/aws-lambda',
  },
  {
    level: 2,
    title: 'Netlify Functions',
    url: '/netlify-functions',
  },
  {
    level: 4,
    title: 'Full-stack',
  },
  {
    level: 2,
    title: 'AWS',
    url: '/aws',
  },
  {
    level: 2,
    title: 'Docker',
    url: '/docker',
  },
  {
    level: 4,
    title: 'Other',
  },
  {
    level: 2,
    title: 'Deploy',
    titleInNav: 'Other deployment',
    url: '/deploy',
  },
  {
    level: 1,
    title: 'Integration',
    titleIcon: iconPlug,
    color: '#616161',
  },
  {
    level: 2,
    title: 'Authentication',
    url: '/auth',
    sectionTitles: ['SSG'],
  },
  {
    level: 2,
    title: 'Server integration',
    url: '/server-integration',
    sectionTitles: ['Non-JavaScript Backend'],
  },
  {
    level: 2,
    title: 'Error Tracking',
    url: '/error-tracking',
  },
  {
    level: 2,
    title: 'CSS-in-JS',
    url: '/css-in-js',
  },
  {
    level: 2,
    title: 'Markdown',
    url: '/markdown',
    sectionTitles: ['With a custom setting (eager)'],
  },
  {
    level: 2,
    title: 'Store (State Management)',
    url: '/store',
  },
  {
    level: 2,
    titleInNav: '... more',
    title: 'Integration (more)',
    url: '/integration',
  },
  {
    level: 1,
    title: 'API',
    titleIcon: iconGear,
    color: '#80c1db',
    menuModalFullWidth: true,
  },
  {
    level: 4,
    title: 'Basics',
  },
  {
    level: 2,
    title: '`pageContext`',
    url: '/pageContext',
  },
  {
    level: 2,
    title: '`globalContext`',
    url: '/globalContext',
  },
  {
    level: 2,
    title: '`+Page`',
    url: '/Page',
  },
  {
    level: 2,
    title: '`+route`',
    url: '/route',
  },
  {
    level: 2,
    title: '`+Head`',
    url: '/Head',
    sectionTitles: ['Only HTML', 'How to inject raw HTML?'],
  },
  {
    level: 2,
    title: '`+Layout`',
    url: '/Layout',
  },
  {
    level: 2,
    title: '`+Wrapper`',
    url: '/Wrapper',
  },
  {
    level: 2,
    title: 'Config Files',
    url: '/config',
    sectionTitles: ['`+` files', '`.clear.js`', '`.default.js`'],
  },
  {
    level: 2,
    title: 'CLI',
    url: '/cli',
  },
  {
    level: 2,
    title: 'JavaScript API',
    url: '/api',
    sectionTitles: ['`prerender()`'],
  },
  {
    level: 2,
    title: 'Error Page',
    url: '/error-page',
  },
  {
    level: 2,
    title: '`+client.js`',
    url: '/client',
  },
  {
    level: 4,
    title: 'Routing',
  },
  {
    level: 2,
    title: 'Filesystem Routing',
    url: '/filesystem-routing',
  },
  {
    level: 2,
    title: 'Route String',
    url: '/route-string',
  },
  {
    level: 2,
    title: 'Route Function',
    url: '/route-function',
  },
  {
    level: 2,
    title: 'Routing Precedence',
    url: '/routing-precedence',
  },
  {
    level: 4,
    title: 'Hooks',
  },
  {
    level: 2,
    title: '`+data()` hook',
    titleInNav: '`+data()`',
    url: '/data',
    sectionTitles: ['`.client.js`', '`.shared.js`', 'Without `vike-{react,vue,solid}`'],
  },
  {
    level: 2,
    title: '`+onData()` hook',
    titleInNav: '`+onData()`',
    url: '/onData',
  },
  {
    level: 2,
    title: '`+guard()` hook',
    titleInNav: '`+guard()`',
    url: '/guard',
  },
  {
    level: 2,
    title: '`+onBeforeRender()` hook',
    titleInNav: '`+onBeforeRender()`',
    url: '/onBeforeRender',
    sectionTitles: ['`onBeforeRender()` + `meta`'],
  },
  {
    level: 2,
    title: '`+onHydrationEnd()` hook',
    titleInNav: '`+onHydrationEnd()`',
    url: '/onHydrationEnd',
  },
  {
    level: 2,
    title: '`+onPageTransitionStart()` hook',
    titleInNav: '`+onPageTransitionStart()`',
    url: '/onPageTransitionStart',
  },
  {
    level: 2,
    title: '`+onCreatePageContext()` hook',
    titleInNav: '`+onCreatePageContext()`',
    url: '/onCreatePageContext',
  },
  {
    level: 2,
    title: '`+onCreateGlobalContext()` hook',
    titleInNav: '`+onCreateGlobalContext()`',
    url: '/onCreateGlobalContext',
  },
  {
    level: 2,
    title: '`+onBeforePrerenderStart()` hook',
    titleInNav: '`+onBeforePrerenderStart()`',
    url: '/onBeforePrerenderStart',
  },
  {
    level: 2,
    title: '`+onPrerenderStart()` hook',
    titleInNav: '`+onPrerenderStart()`',
    url: '/onPrerenderStart',
  },
  {
    level: 2,
    title: 'Hooks',
    titleInNav: '... more',
    url: '/hooks',
  },
  {
    level: 4,
    title: 'Utils (server- & client-side)',
  },
  {
    level: 2,
    title: '`useData()`',
    url: '/useData',
    sectionTitles: ['Without `vike-{react,vue,solid}`'],
  },
  {
    level: 2,
    title: '`usePageContext()`',
    url: '/usePageContext',
  },
  {
    level: 2,
    title: '`useConfig()`',
    url: '/useConfig',
    sectionTitles: ['UI components'],
  },
  {
    level: 2,
    title: '`getGlobalContext()`',
    url: '/getGlobalContext',
  },
  {
    level: 2,
    title: '`throw redirect()`',
    url: '/redirect',
  },
  {
    level: 2,
    title: '`throw render()`',
    url: '/render',
  },
  {
    level: 2,
    title: '`clientOnly()`',
    url: '/clientOnly',
  },
  {
    level: 2,
    title: '`modifyUrl()`',
    url: '/modifyUrl',
  },
  {
    level: 4,
    title: 'Utils (client-side)',
  },
  {
    level: 2,
    title: '`navigate()`',
    url: '/navigate',
  },
  {
    level: 2,
    title: '`reload()`',
    url: '/reload',
  },
  {
    level: 2,
    title: '`prefetch()`',
    url: '/prefetch',
  },
  {
    level: 4,
    title: 'Utils (server-side)',
  },
  {
    level: 2,
    title: '`renderPage()`',
    url: '/renderPage',
  },
  {
    level: 2,
    title: '`escapeInject`',
    url: '/escapeInject',
  },
  {
    level: 2,
    title: '`injectFilter()`',
    url: '/injectFilter',
  },
  {
    level: 4,
    title: 'Settings',
  },
  {
    level: 2,
    title: '`+title`',
    url: '/title',
  },
  {
    level: 2,
    title: '`+description`',
    url: '/description',
  },
  {
    level: 2,
    title: '`+image`',
    url: '/image',
  },
  {
    level: 2,
    title: '`+viewport`',
    url: '/viewport',
  },
  {
    level: 2,
    title: '`+htmlAttributes`',
    url: '/htmlAttributes',
  },
  {
    level: 2,
    title: '`+bodyAttributes`',
    url: '/bodyAttributes',
  },
  {
    level: 2,
    title: '`+ssr`',
    url: '/ssr',
  },
  {
    level: 2,
    title: '`+stream`',
    url: '/stream',
  },
  {
    level: 2,
    title: '`+server`',
    url: '/server',
  },
  {
    level: 2,
    title: '`+prerender`',
    url: '/prerender',
    sectionTitles: ['`disableAutoRun`', '`redirects`'],
  },
  {
    level: 2,
    title: '`+redirects`',
    url: '/redirects',
  },
  {
    level: 2,
    title: '`+keepScrollPosition`',
    url: '/keepScrollPosition',
  },
  {
    level: 2,
    title: '`+prefetchStaticAssets`',
    url: '/prefetchStaticAssets',
  },
  {
    level: 2,
    title: '`+hooksTimeout`',
    url: '/hooksTimeout',
  },
  {
    level: 2,
    title: '`+passToClient`',
    url: '/passToClient',
  },
  {
    level: 2,
    title: '`+headersResponse`',
    url: '/headersResponse',
  },
  {
    level: 2,
    title: '`+csp`',
    url: '/csp',
  },
  {
    level: 2,
    title: '`+clientRouting`',
    url: '/clientRouting',
  },
  {
    level: 2,
    title: '`+meta`',
    url: '/meta',
    sectionTitles: [
      'Example: `+dataEndpointUrl`',
      'Example: `+sql`',
      'Example: `+title` and `+description`',
      'Example: `+Layout`',
      'Example: modify `+data` env',
    ],
  },
  {
    level: 2,
    title: 'Settings',
    titleInNav: '... more',
    url: '/settings',
    sectionTitles: ['HTML shell'],
  },
] as const satisfies HeadingDefinition[]

const headingsDetached = [
  ...api(),
  ...guides(),
  ...extensions(),
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
        title: 'Hattip',
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
        sectionTitles: ['CSS-in-JS', 'Internationalization (i18n)'],
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
      {
        title: 'Lingui',
        url: '/lingui',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Guides (tools)' as const })) satisfies HeadingDetachedDefinition[]
}

function extensions() {
  return (
    [
      {
        title: '`vike-react`',
        url: '/vike-react',
      },
      {
        title: '`vike-vue`',
        url: '/vike-vue',
      },
      {
        title: '`vike-solid`',
        url: '/vike-solid',
      },
      {
        title: '`vike-server`',
        url: '/vike-server',
        sectionTitles: ['HTTPS'],
        category: 'Overview',
      },
    ] as const
  ).map((h) => ({ ...h, category: 'Extensions' as const })) satisfies HeadingDetachedDefinition[]
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
        title: '`process.env.NODE_ENV`',
        url: '/NODE_ENV',
      },
      {
        title: '[Warning] Wrong setup',
        url: '/warning/setup',
      },
      {
        title: '[Error] Runtime code defined in config file',
        url: '/error/runtime-in-config',
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
        title: 'What is SSR and SPA?',
        url: '/what-is-SSR-and-SPA',
        sectionTitles: [
          'SPA is a misnomer'
        ],
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
        title: 'Client runtimes conflict',
        url: '/client-runtimes-conflict',
      },
      {
        title: 'Client runtime loaded twice',
        url: '/client-runtime-duplicated',
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
        title: '`+onRenderHtml()` hook',
        url: '/onRenderHtml',
      },
      {
        title: '`+onRenderClient()` hook',
        url: '/onRenderClient',
      },
      {
        title: '`+onBeforeRoute()` hook',
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
        title: '`+onCreateApp()` hook',
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
        title: '`reactStrictMode`',
        url: '/reactStrictMode',
      },
      {
        title: '`+onPageTransitionEnd()` hook',
        url: '/onPageTransitionEnd',
      },
      {
        title: '`+onBeforeRenderClient()` hook',
        url: '/onBeforeRenderClient',
      },
      {
        title: '`+onAfterRenderClient()` hook',
        url: '/onAfterRenderClient',
      },
      {
        title: '`+onBeforeRenderHtml()` hook',
        url: '/onBeforeRenderHtml',
      },
      {
        title: '`+onAfterRenderHtml()` hook',
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
        title: 'Vite plugin',
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
        title: 'Multiple `+onBeforeRender()` hooks',
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
