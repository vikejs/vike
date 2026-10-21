export default guard

import { render } from 'vike/abort'

async function guard() {
  throw render(499 as any, 'Testing throw render error page.')
}
