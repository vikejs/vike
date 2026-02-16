import universalVikeHandler from './universal-middleware.js'
import { apply } from '@universal-middleware/srvx'
import { enhance } from '@universal-middleware/core'
// TODO: requires noExternal for 'vike'
// @ts-expect-error virtual module
import middlewares from 'virtual:vike:+middlewares'

export default {
  fetch: apply([
    enhance(universalVikeHandler, {
      name: 'vike',
      method: ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'],
      path: '/**',
      immutable: true,
    }),
    ...middlewares,
  ]),
}
