import { Config } from 'vike/types'

// dependentSetting is influenced both by the ConfigEffect
// of settingWithEffect and by a locally set value
export default {
  settingWithEffect: 'setEnvAndValue',
} satisfies Config
