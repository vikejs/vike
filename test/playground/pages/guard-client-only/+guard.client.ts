export { guard }

import { redirect } from 'vike/abort'

function guard() {
  throw redirect('/star-wars')
}
