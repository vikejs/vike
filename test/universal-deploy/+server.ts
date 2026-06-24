import type { Server } from 'vike/types'
import vike, { toFetchHandler } from '@vikejs/express'
import { getUniversalMiddlewares } from 'vike/getUniversalMiddlewares'
import {
  apply,
  enhance,
  universalSymbol,
  UniversalRouter,
  type HttpMethod,
  type UniversalHandler,
} from '@universal-middleware/core'
import express from 'express'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

const httpMethods: HttpMethod[] = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']

// Applies the app's +middleware (Universal Middlewares), e.g. the Telefunc middleware, to all URLs.
//
// The +middleware are resolved *lazily* (upon the first request) on purpose: resolving them eagerly
// (`await getUniversalMiddlewares()` at startup) would, in development, await Vike's dev server before
// it's ready — deadlocking, since Vike's dev server awaits this server entry to finish loading.
let middlewaresPromise: ReturnType<typeof getUniversalMiddlewares> | undefined
const universalMiddlewares = enhance(
  async (request, context, runtime) => {
    const middlewares = await (middlewaresPromise ??= getUniversalMiddlewares())
    if (middlewares.length === 0) return
    const router = new UniversalRouter(true, false)
    const fallThrough = new Response(null)
    apply(router, [
      enhance(() => fallThrough, { name: 'fall-through', method: httpMethods, path: '/**', immutable: true }),
      ...middlewares,
    ])
    const handler = router[universalSymbol] as UniversalHandler
    const response = await handler(request, context, runtime)
    // No +middleware handled the request: fall through to Vike's render handler.
    return response === fallThrough ? undefined : response
  },
  { name: 'universal-middlewares' },
)

async function serve() {
  const app = express()

  app.get('/express', (_req, res) => res.send('Running express server'))

  vike(app, [universalMiddlewares])

  return toFetchHandler(app)
}

export default {
  fetch: await serve(),
  prod: { port },
} satisfies Server
