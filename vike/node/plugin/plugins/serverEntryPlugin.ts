import { Plugin } from 'vite'
import { ConfigVikeUserProvided } from '../../../shared/ConfigVike.js'
import { standalone } from './standalonePlugin.js'

export const serverEntry = (configVike?: ConfigVikeUserProvided): Plugin[] => {
  let isSsrBuild = false
  const server = configVike?.server
  if (!configVike?.server) {
    return []
  }

  const serverEntryPlugin = (): Plugin => {
    return {
      name: 'vike:serverEntry',
      enforce: 'pre',
      config(config, env) {
        //@ts-expect-error Vite 5 || Vite 4
        isSsrBuild = !!(env.isSsrBuild || env.ssrBuild)
        if (isSsrBuild) {
          return {
            build: {
              rollupOptions: {
                input: server
              }
            }
          }
        }
      }
    }
  }

  return [serverEntryPlugin(), configVike?.standalone && standalone()].filter(Boolean) as Plugin[]
}
