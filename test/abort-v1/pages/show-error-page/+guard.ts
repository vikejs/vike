export default guard

import { render } from 'vite-plugin-ssr/abort'

async function guard() {
  throw render(503, 'Testing throw render error page.')
}
