export { onError }

import type { Config } from 'vike/types'

const onError: Config['onError'] = (error, pageContext) => {
  /*
  console.error('+onError', pageContext?.pageId, error)
  //*/
}
