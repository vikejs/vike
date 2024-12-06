import { Config } from 'vike/types'

declare global {
  namespace Vike {
    interface Config {
      settingStandard?: { nested: string }
      settingCumulative?: { nested: string }
    }
    interface ConfigResolved {
      settingCumulative?: { nested: string }[]
    }
  }
}
