import { getMagicString } from '../../shared/getMagicString.js'
import { serverEntryVirtualId } from '@brillout/vite-plugin-server-entry/plugin'
import type { Plugin } from 'vite'
import { pluginCommon } from './common.js'
import '../../assertEnvVite.js'

export function pluginServerEntryInject(serverEntryId: string): Plugin {
  return {
    name: 'vike:pluginUniversalDeploy:serverEntry',
    apply: 'build',
    transform: {
      order: 'post',
      filter: {
        id: {
          include: [serverEntryId],
        },
      },
      handler(code, id) {
        const { magicString, getMagicStringResult } = getMagicString(code, id)
        // Inject Vike virtual server entry
        magicString.prepend(`import "${serverEntryVirtualId}";\n`)
        return getMagicStringResult()
      },
    },
    ...pluginCommon,
  }
}
