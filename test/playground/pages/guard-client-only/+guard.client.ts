export { guard }

import { redirect } from 'vike/abort'

function guard() {
  console.log('called +guard.client.ts')
  throw redirect('/star-wars')
}
