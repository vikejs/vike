import { enhance, MiddlewareOrder } from '@universal-middleware/core'

// The only +middleware, and it isn't a handler
const header = enhance(
  () => (response: Response) => {
    response.headers.set('x-middleware', 'header')
    return response
  },
  { name: 'header', order: MiddlewareOrder.HEADER_MANAGEMENT },
)

export default [header]
