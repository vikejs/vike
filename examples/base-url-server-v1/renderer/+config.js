import { baseServer, baseAssets } from '../base'

export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps'],
  baseAssets,
  baseServer
}
