export type { Server }

import type { Fetchable, ServerOptions } from '@universal-deploy/store'

/** Server options.
 *
 * https://vike.dev/server
 */
interface Server extends Fetchable {
  prod?: Omit<ServerOptions, 'fetch'> & { static?: boolean | string }
}
