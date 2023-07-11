export default guard

import { renderUrl } from 'vite-plugin-ssr/abort'

async function guard() {
  throw renderUrl('/')
}
