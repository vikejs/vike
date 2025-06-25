export { redirects }

import type { Config } from 'vike/types'
import type { HeadingsURL } from './headings'
import type { HeadingsDetachedURL } from './headingsDetached'

type URLs = HeadingsURL | HeadingsDetachedURL

const redirects = {
  '/common-problems': '/common-issues',
  '/data-tools': '/data-fetching#page-data-with-tools' as '/data-fetching',
  '/https': '/server#https' as '/server',
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
  '/header-file': '/config#pointer-imports' as '/config',
  '/header-file/import-from-same-file': '/config#pointer-imports' as '/config',
  '/vue-router-and-react-router': '/react-router',
  '/react-query': '/tanstack-query',
  '/useClientRouter': '/clientRouting',
  '/html-streaming': '/streaming',
  '/preload': '/preloading',
  '/layouts': '/Layout',
  '/nextauth': '/Auth.js',
  '/NextAuth.js': '/Auth.js',
  '/html-head': '/head-tags',
  '/SR-vs-CR': '/server-routing-vs-client-routing',
  '/render-as-you-fetch': '/streaming',
  '/v1-design': '/migration/v1-design',
  '/config-code-splitting': '/config#pointer-imports' as '/config',
  '/dynamic-import': '/clientOnly',
  '/.env-files': '/env',
  '/vike-server': '/server',
  '/cloudflare-workers': '/cloudflare',
  '/migration-0.4': '/migration/0.4',
} satisfies Config['redirects'] & Record<string, URLs>
