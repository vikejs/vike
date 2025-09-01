export { config as default }

import vikeServer from 'vike-server/config'

// https://vike.dev/config
const config = {
  // https://vike.dev/vike-server
  extends: [vikeServer],
  server: 'server/index.js',

  // https://vike.dev/clientRouting
  clientRouting: true,
  hydrationCanBeAborted: true,

  // https://vike.dev/meta
  meta: {
    // Define new setting 'title'
    title: {
      env: { server: true, client: true },
    },
    // Define new setting 'description'
    description: {
      env: { server: true },
    },
  },
}
