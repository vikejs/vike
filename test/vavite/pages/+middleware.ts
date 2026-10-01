import { enhance } from '@universal-middleware/core'

export default enhance(
  async () => (response: Response) => {
    response.headers.append('x-middleware', 'ran')
    return response
  },
  { name: 'responseHeaderMiddleware' },
)
