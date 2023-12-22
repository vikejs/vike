export default guard

import { render } from 'vike/abort'

async function guard() {
  throw render(503, 'Testing throw render error page.')
}
