import { assert } from './utils'
export function getBaseUrl(): string {
  const baseUrl: string = import.meta.env.BASE_SERVER
  assert(baseUrl.startsWith('/'))
  return baseUrl
}
