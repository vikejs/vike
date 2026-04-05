export { Middleware }

import type { UniversalMiddleware } from '@universal-middleware/core'

type Middleware = {
  name: string
  order: 'pre' | 'post' | number
  value: UniversalMiddleware
}
