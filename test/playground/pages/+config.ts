import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  title: 'Big Playground',
  prerender: true,
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
    '/external-redirect': 'https://app.nmrium.org#?toc=https://cheminfo.github.io/nmr-dataset-demo/samples.json'
  },
  extends: [vikeReact],
  meta: {
    frontmatter: {
      env: { server: true }
    }
  },
  passToClient: [
    // TEST: pass nested prop
    'someWrapperObj.staticUrls',
    // TEST: use passToClient for globalContext
    'setGloballyServer'
  ]
} satisfies Config
