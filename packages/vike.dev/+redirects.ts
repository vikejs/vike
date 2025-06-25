export { redirects }

// TO-DO/eventually: move all redirects here

import type { Config } from 'vike/types'

const redirects = {
  '/common-problems': '/common-issues',
  '/data-tools': '/data-fetching#page-data-with-tools',
  '/https': '/server#https',
  '/css-tools': '/css-in-js',
  '/errors': '/error-tracking',
  '/SPA-vs-SSR-vs-HTML': '/render-modes',
  '/Head-setting': '/head-tags',
  '/head': '/head-tags',
  '/ClientOnly': '/clientOnly',
  '/add-ssr-to-vite-app': '/add',
  '/scaffold': '/new',
  '/prerender-config': '/prerender',
  '/pageContext-anywhere': '/pageContext',
  '/client-only-components': '/clientOnly',
  '/vike-packages': '/extensions',
  '/page-redirection': '/redirect',
} satisfies Config['redirects']
