import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

export default {
  title: 'Big Playground',
  prerender: true,
  redirects: {
    // TEST: redirect to email
    '/mail': 'mailto:some@example.com'
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
