import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
// TEST: programmatically defined pages (config.pages)
import ProgrammaticPage from './programmatically-defined/ProgrammaticPage'
// TEST: a Route Function for a programmatically defined page — it's a pointer import so Vike loads it at runtime.
import programmaticRoute from './programmatically-defined/route' with { type: 'vike:pointer' }

export default {
  title: 'Big Playground',
  // TEST: define pages programmatically instead of with +Page/+config files.
  pages: [
    {
      route: '/programmatic',
      Page: ProgrammaticPage,
      prerender: true,
    },
    // TEST: a programmatically defined page using a Route Function.
    {
      route: programmaticRoute,
      Page: ProgrammaticPage,
    },
  ],
  prerender: {
    redirects: true,
    // Suppress warning:
    // ```bash
    // [11:27:09.496][/test/playground/test-preview.test.ts][npm run preview][stderr] 11:27:09 AM [vike][Warning] Dynamic redirect /product/@id -> /buy/@id cannot be pre-rendered
    // ```
    partial: true,
  },
  redirects: {
    // TEST: +redirects as documented at https://vike.dev/redirects
    '/about-us': '/about',
    '/products/computer': '/produkte/komputer',
    /* TO-DO/eventually: it doesn't work — make it work
    '/product?category=computer': '/produkte?kategorie=komputer',
    */
    '/chat': 'https://discord.com/invite/hfHhnJyVg8',
    '/mail': 'mailto:some@example.com',
    '/download': 'magnet:?xt=urn:btih:example',
    '/product/@id': '/buy/@id',
    '/admin/*': '/private/*',
    '/admins/*': 'https://admin.example.org/*',
    // TEST: redirect edge cases
    '/external-redirect': 'https://app.nmrium.org#?toc=https://cheminfo.github.io/nmr-dataset-demo/samples.json',
  },
  extends: [vikeReact],
  meta: {
    frontmatter: {
      env: { server: true },
    },
  },
  passToClient: [
    // TEST: pass nested prop
    'someWrapperObj.staticUrls',
    // TEST: use passToClient for globalContext
    'setGloballyServer',
    // TEST: pass Date to client
    'someDate',
  ],
  headersResponse: {
    'some-static-header': 'some-static-header-value',
  },
} satisfies Config
