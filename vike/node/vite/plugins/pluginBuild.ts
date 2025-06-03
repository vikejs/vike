export { pluginBuild }

import type { Plugin } from 'vite'
import { pluginBuildApp } from './build/pluginBuildApp.js'
import { pluginDistPackageJsonFile } from './build/pluginDistPackageJsonFile.js'
import { pluginSuppressRollupWarning } from './build/pluginSuppressRollupWarning.js'
import { pluginDistFileNames } from './build/pluginDistFileNames.js'
import { pluginAutoFullBuild } from './build/pluginAutoFullBuild.js'
import { pluginBuildEntry } from './build/pluginBuildEntry.js'
import { pluginBuildConfig } from './build/pluginBuildConfig.js'
import { pluginModuleBanner } from './build/pluginModuleBanner.js'

function pluginBuild(): Plugin[] {
  return [
    ...pluginBuildConfig(),
    ...pluginBuildApp(),
    ...pluginAutoFullBuild(),
    ...pluginBuildEntry(),
    pluginDistPackageJsonFile(),
    pluginSuppressRollupWarning(),
    pluginDistFileNames(),
    pluginModuleBanner()
  ]
}
