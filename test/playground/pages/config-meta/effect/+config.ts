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
        return (configValue as boolean)
          ? {
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
