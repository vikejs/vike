export { headings }

import {
  iconScroll,
  iconCompass,
  iconGear,
  type HeadingDefinition,
  iconSeedling,
  iconGlobe,
  iconPlug
} from '@brillout/docpress'

const headings = [
  {
    level: 1,
    title: 'Overview',
    titleIcon: iconCompass,
    color: '#e1a524'
  },
  {
    level: 2,
    title: 'Introduction',
    titleDocument: 'Vike',
    url: '/'
  },
  {
    level: 2,
    title: 'FAQ',
    url: '/faq'
  },
  {
    level: 2,
    title: 'Why Vike',
    url: '/why'
  },
  {
    level: 2,
    title: 'Open Source Pricing',
    url: '/pricing'
  },
  {
    level: 2,
    title: 'Extensions',
    url: '/extensions'
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
    url: '/team'
  },
  {
    level: 1,
    title: 'Get Started',
    titleIcon: iconSeedling,
    color: '#74d717'
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
      contentMaxWidth: 1200
    },
    url: '/new'
  },
  {
    level: 2,
    title: 'Add SSR/SSG to existing Vite app',
    url: '/add',
    pageDesign: {
      hideMenuLeft: true
    }
  },
  {
    level: 1,
    title: 'Guides',
    titleIcon: iconScroll,
    color: '#ffd511'
  },
  {
    level: 4,
    title: 'Basics'
  },
  {
    level: 2,
    title: 'Data Fetching',
    url: '/data-fetching',
    sectionTitles: ['Pre-rendering (SSG)']
  },
  {
    level: 2,
    title: 'Pre-rendering (SSG)',
    url: '/pre-rendering'
  },
  {
    level: 2,
    title: '`<head>` tags',
    url: '/head-tags'
  },
  {
    level: 2,
    title: 'Common Issues',
    url: '/common-issues'
  },
  {
    level: 4,
    title: 'Routing'
  },
  {
    level: 2,
    title: 'Routing',
    url: '/routing',
    sectionTitles: ['Filesystem Routing', '`src/`']
  },
  {
    level: 2,
    title: 'Base URL',
    url: '/base-url'
  },
  {
    level: 2,
    title: 'Active Links',
    url: '/active-links'
  },
  {
    level: 4,
    title: 'More'
  },
  {
    level: 2,
    title: 'Static Directory (`public/`)',
    url: '/static-directory'
  },
  {
    level: 2,
    title: '`.server.js` / `.client.js` / `.shared.js`',
    titleInNav: '`.server.js`/`.client.js`/`.shared.js`',
    url: '/file-env'
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
    title: 'Paths Aliases',
    url: '/path-aliases'
  },
  {
    level: 2,
    title: 'Preloading',
    url: '/preloading'
  },
  {
    level: 2,
    title: 'API Routes',
    url: '/api-routes'
  },
  {
    level: 1,
    title: 'Deploy',
    titleIcon: iconGlobe,
    color: '#2d81f1'
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
    url: '/cloudflare-pages',
    sectionTitles: ['Full-stack']
  },
  {
    level: 2,
    title: 'Netlify',
    url: '/netlify'
  },
  {
    level: 2,
    title: 'Static Hosts',
    titleInNav: '... more',
    url: '/static-hosts'
  },
  {
    level: 4,
    title: 'Serverless'
  },
  {
    level: 2,
    title: 'Cloudflare',
    url: '/cloudflare',
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
    level: 4,
    title: 'Other'
  },
  {
    level: 2,
    title: 'Deploy',
    titleInNav: 'Other deployment',
    url: '/deploy'
  },
  {
    level: 1,
    title: 'Integration',
    titleIcon: iconPlug,
    color: '#616161'
  },
  {
    level: 2,
    title: 'Authentication',
    url: '/auth',
    sectionTitles: ['SSG']
  },
  {
    level: 2,
    title: 'Server',
    url: '/server'
  },
  {
    level: 2,
    title: 'Error Tracking',
    url: '/error-tracking'
  },
  {
    level: 2,
    title: 'CSS-in-JS',
    url: '/css-in-js'
  },
  {
    level: 2,
    title: 'Markdown',
    url: '/markdown'
  },
  {
    level: 2,
    title: 'Store (State Management)',
    url: '/store',
    sectionTitles: ['SSR']
  },
  {
    level: 2,
    titleInNav: '... more',
    title: 'Integration (more)',
    sectionTitles: ['Non-JavaScript Backend', 'Server (manual integration)'],
    url: '/integration'
  },
  {
    level: 1,
    title: 'API',
    titleIcon: iconGear,
    color: '#80c1db',
    menuModalFullWidth: true
  },
  {
    level: 4,
    title: 'Basics'
  },
  {
    level: 2,
    title: '`pageContext`',
    url: '/pageContext'
  },
  {
    level: 2,
    title: '`globalContext`',
    url: '/globalContext'
  },
  {
    level: 2,
    titleInNav: '`Page`',
    title: '`<Page>`',
    url: '/Page'
  },
  {
    level: 2,
    title: '`route`',
    url: '/route'
  },
  {
    level: 2,
    titleInNav: '`Head`',
    title: '`Head`',
    url: '/Head',
    sectionTitles: ['Only HTML', 'How to inject raw HTML?']
  },
  {
    level: 2,
    titleInNav: '`Layout`',
    title: '`<Layout>`',
    url: '/Layout'
  },
  {
    level: 2,
    title: 'Config Files',
    url: '/config',
    sectionTitles: ['`+` files']
  },
  {
    level: 2,
    title: 'CLI',
    url: '/cli'
  },
  {
    level: 2,
    title: 'JavaScript API',
    url: '/api',
    sectionTitles: ['`prerender()`']
  },
  {
    level: 2,
    title: 'Error Page',
    url: '/error-page'
  },
  {
    level: 2,
    title: '`+client.js`',
    url: '/client'
  },
  {
    level: 4,
    title: 'Routing'
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
    title: 'Routing Precedence',
    url: '/routing-precedence'
  },
  {
    level: 4,
    title: 'Hooks'
  },
  {
    level: 2,
    title: '`data()` hook',
    titleInNav: '`data()`',
    url: '/data',
    sectionTitles: ['Without `vike-{react,vue,solid}`']
  },
  {
    level: 2,
    title: '`onData()` hook',
    titleInNav: '`onData()`',
    url: '/onData'
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
    url: '/onBeforeRender',
    sectionTitles: ['`onBeforeRender()` + `meta`']
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
    title: '`onCreatePageContext()` hook',
    titleInNav: '`onCreatePageContext()`',
    url: '/onCreatePageContext'
  },
  {
    level: 2,
    title: '`onCreateGlobalContext()` hook',
    titleInNav: '`onCreateGlobalContext()`',
    url: '/onCreateGlobalContext'
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
    titleInNav: '... more',
    url: '/hooks'
  },
  {
    level: 4,
    title: 'Utils (server- & client-side)'
  },
  {
    level: 2,
    title: '`useData()`',
    url: '/useData',
    sectionTitles: ['TypeScript', 'Without `vike-{react,vue,solid}`']
  },
  {
    level: 2,
    title: '`usePageContext()`',
    url: '/usePageContext'
  },
  {
    level: 2,
    title: '`useConfig()`',
    url: '/useConfig'
  },
  {
    level: 2,
    title: '`getGlobalContext()`',
    url: '/getGlobalContext'
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
    level: 2,
    title: '`clientOnly()`',
    url: '/clientOnly'
  },
  {
    level: 2,
    title: '`modifyUrl()`',
    url: '/modifyUrl'
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
    level: 4,
    title: 'Settings'
  },
  {
    level: 2,
    title: '`title`',
    url: '/title'
  },
  {
    level: 2,
    title: '`description`',
    url: '/description'
  },
  {
    level: 2,
    title: '`image`',
    url: '/image'
  },
  {
    level: 2,
    title: '`viewport`',
    url: '/viewport'
  },
  {
    level: 2,
    title: '`htmlAttributes`',
    url: '/htmlAttributes'
  },
  {
    level: 2,
    title: '`bodyAttributes`',
    url: '/bodyAttributes'
  },
  {
    level: 2,
    title: '`ssr`',
    url: '/ssr'
  },
  {
    level: 2,
    title: '`stream`',
    url: '/stream'
  },
  {
    level: 2,
    title: '`+prerender`',
    url: '/prerender',
    sectionTitles: ['`disableAutoRun`']
  },
  {
    level: 2,
    title: '`redirects`',
    url: '/redirects'
  },
  {
    level: 2,
    title: '`keepScrollPosition`',
    url: '/keepScrollPosition'
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
      'Example: `+dataEndpointUrl`',
      'Example: `+sql`',
      'Example: `+title` and `+description`',
      'Example: `+Layout`',
      'Example: modify `+data` env'
    ]
  },
  {
    level: 2,
    title: 'Settings',
    titleInNav: '... more',
    url: '/settings',
    sectionTitles: ['HTML']
  }
] satisfies HeadingDefinition[]
