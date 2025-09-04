export { redirects }

import type { Config } from 'vike/types'
import type { HeadingsURL } from './headings'
import { checkType } from './utils/checkType'

// Use TypeScript to check whether redirect targets point to an existing page
type RemoveHash<T extends string> = T extends `${infer Path}#${string}` ? Path : T
type RedirectsURL = RemoveHash<(typeof redirects)[keyof typeof redirects]>
checkType<HeadingsURL>(0 as any as RedirectsURL)

const redirects = {
  '/common-problems': '/common-issues',
  '/data-tools': '/data-fetching#page-data-with-tools',
  '/https': '/server#https',
  '/css-tools': '/css-in-js',
  '/errors': '/error-tracking',
  '/SPA-vs-SSR-vs-HTML': '/render-modes',
  '/Head-setting': '/head-tags',
  '/head': '/head-tags',
  '/CSP': '/csp',
  '/ClientOnly': '/clientOnly',
  '/add-ssr-to-vite-app': '/add',
  '/scaffold': '/new',
  '/prerender-config': '/prerender',
  '/pageContext-anywhere': '/pageContext',
  '/client-only-components': '/clientOnly',
  '/vike-packages': '/extensions',
  '/page-redirection': '/redirect',
  '/header-file': '/config#pointer-imports',
  '/header-file/import-from-same-file': '/config#pointer-imports',
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
  '/config-code-splitting': '/config#pointer-imports',
  '/dynamic-import': '/clientOnly',
  '/.env-files': '/env',
  '/cloudflare-workers': '/cloudflare',
  '/migration-0.4': '/migration/0.4',
  '/catch-all': '/route-string#catch-all',
} as const satisfies Config['redirects']
