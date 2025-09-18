export { onError }

import type { Config } from 'vike/types'

const onError: Config['onError'] = (error) => {
  // TODO start using convention
  console.error('+onError', error)
}
