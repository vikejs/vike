import { Config } from 'vike/types'

export default {
  settingStandard: { nested: 'override for standard @ /deeply-nested' },
  settingCumulative: { nested: 'override for cumulative @ /deeply-nested' },
} satisfies Config
