export { onError }

import type { Config } from 'vike/types'

const onError: Config['onError'] = (error) => {
  console.error('+onError', error)
}
