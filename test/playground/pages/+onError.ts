export { onError }

import type { Config } from 'vike/types'

//*
const LOG = false
/*/
const LOG = true
//*/

const onError: Config['onError'] = (error, pageContext) => {
  if (LOG) {
    console.error('+onError', pageContext?.pageId, error)
  }
}
