import type { Fetchable, ServerOptions } from '@universal-deploy/store'

/** Server options.
 *
 * https://vike.dev/server
 */
export interface Server extends Fetchable {
  prod?: Omit<ServerOptions, 'fetch'>
}
