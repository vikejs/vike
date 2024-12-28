declare global {
  namespace Vike {
    interface Config {
      settingServerOnly?: { nested: string }
      settingClientOnly?: { nested: string }
      settingConfigOnly?: { nested: string }
      settingStandard?: { nested: string }
      settingCumulative?: { nested: string }
      settingWithEffect?: boolean
      dependentSetting?: string
    }
    interface ConfigResolved {
      settingCumulative?: { nested: string }[]
    }
  }
}

export {}
