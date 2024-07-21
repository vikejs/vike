// import type { Config } from 'vike/types'
// import vikeNode from './plugin/index.js'
// import type { ConfigVikeNode } from './types.js'

// declare global {
//   namespace Vike {
//     interface Config extends ConfigVikeNode {}
//   }
// }

// const config: Omit<Config, keyof ConfigVikeNode> & Partial<ConfigVikeNode> = {
//   vite: {
//     plugins: [vikeNode()]
//   },
//   meta: {
//     server: {
//       env: {
//         config: true
//       }
//     }
//   }
// }
// export default config as Config
// TODO
export default {}
