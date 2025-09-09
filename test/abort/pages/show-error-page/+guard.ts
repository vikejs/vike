export default guard

import { render } from 'vike/abort'

async function guard() {
  throw render(666 as any, 'Testing throw render error page.')
}
