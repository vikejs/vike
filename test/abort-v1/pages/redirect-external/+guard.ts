export default guard

import { redirect } from 'vike/abort'

async function guard() {
  throw redirect('https://vite-plugin-ssr.com')
}
