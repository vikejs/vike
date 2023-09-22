export default guard

import { redirect } from 'vike/abort'

async function guard() {
  throw redirect('https://vike.dev')
}
