import type { Config } from 'vike/types'

export default {
  // TEST: define `Page` over import string at `+config.js > export default { Page }` instead of +Page.js file.
  // @ts-expect-error I ain't sure whether import strings should be part of the official type, but I think so.
  Page: 'import:./Page.jsx',
  // TEST: route defined over `+config.js > export default { route }`
  route: '/about',
  prerender: false
} satisfies Config
