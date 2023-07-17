export default guard

import { redirect } from 'vite-plugin-ssr/abort'

async function guard() {
  throw redirect(301, '/')
}
