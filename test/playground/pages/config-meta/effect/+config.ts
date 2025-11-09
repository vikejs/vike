import { assert } from '../../../utils/assert'
import type { Config } from 'vike/types'

export default {
  dependentSetting: 'default @ /effect',
  meta: {
    dependentSetting: {
      env: { server: false, client: false },
    },
    settingWithEffect: {
      env: { server: false, client: false, config: true },
      effect: function ({ configValue, configDefinedAt }) {
        const val = configValue as Config['settingWithEffect']
        if (!val) return
        assert(val === 'setEnvAndValue' || configValue === 'setEnvOnly', { configDefinedAt })
        return {
          dependentSetting: configValue === 'setEnvAndValue' ? 'set by settingWithEffect' : undefined,
          meta: {
            dependentSetting: {
              env: { server: true, client: true },
            },
          },
        }
      },
    },
  },
} satisfies Config
