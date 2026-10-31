export { onError }

import type { Config } from 'vike/types'

//*
const LOG = false
/*/
const LOG = true
//*/

const onError: Config['onError'] = (error, pageContext) => {
  // TEST: +onError receives the error as thrown
  if (error instanceof Error) console.log(`+onError received: ${JSON.stringify(error.message)}`)
  if (LOG) {
    console.error('+onError', pageContext?.pageId, error)
  }
}
