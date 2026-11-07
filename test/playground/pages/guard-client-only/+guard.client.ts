export { guard }

import { redirect } from 'vike/abort'

function guard() {
  // Thrown synchronously, while +onHookCall wraps the hook
  if (location.search === '?throw-null') throw null
  throw redirect('/star-wars')
}
