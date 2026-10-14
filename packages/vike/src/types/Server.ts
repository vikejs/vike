export type { Server }

import type { Fetchable, ServerOptions } from '@universal-deploy/store'

/**
 * Server settings.
 *
 * https://vike.dev/server
 */
interface Server extends Partial<Fetchable> {
  prod?: Omit<ServerOptions, 'fetch'> & { static?: boolean | string }
}
