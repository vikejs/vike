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
        configValue = configValue as Config['settingWithEffect']
        return configValue
          ? {
              dependentSetting: configValue === 'setEnvAndValue' ? 'defined by settingWithEffect' : undefined,
              meta: {
                dependentSetting: {
                  env: { server: true, client: true },
                },
              },
            }
          : {}
      },
    },
  },
} satisfies Config
