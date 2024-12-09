import { telefunc } from 'telefunc'
// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type { Get, UniversalHandler } from '@universal-middleware/core'

export const telefuncHandler: Get<[], UniversalHandler> = () => async (request, context, runtime) => {
  const httpResponse = await telefunc({
    url: request.url.toString(),
    method: request.method,
    body: await request.text(),
    context: {
      ...context,
      ...runtime
    }
  })
  const { body, statusCode, contentType } = httpResponse
  return new Response(body, {
    status: statusCode,
    headers: {
      'content-type': contentType
    }
  })
}
