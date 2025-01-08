export { build_ as build }
export { dev_ as dev }
export { preview_ as preview }
export { prerender_ as prerender }

import type { build } from './build.js'
import type { dev } from './dev.js'
import type { preview } from './preview.js'
import type { prerender } from './prerender.js'
import { assertIsNotBrowser } from '../../utils/assertIsNotBrowser.js'
assertIsNotBrowser()

const build_: typeof build = async (...args) => (await import('./build.js')).build(...args)
const dev_: typeof dev = async (...args) => (await import('./dev.js')).dev(...args)
const preview_: typeof preview = async (...args) => (await import('./preview.js')).preview(...args)
const prerender_: typeof prerender = async (...args) => (await import('./prerender.js')).prerender(...args)
