import { assert } from './utils'
export function getBaseServer(): string {
  const baseServer: string = import.meta.env.BASE_SERVER
  assert(baseServer.startsWith('/'))
  return baseServer
}
