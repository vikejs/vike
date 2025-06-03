export { pluginBuild }

import type { Plugin } from 'vite'
import { pluginBuildApp } from './pluginBuild/pluginBuildApp.js'
import { pluginDistPackageJsonFile } from './pluginBuild/pluginDistPackageJsonFile.js'
import { pluginSuppressRollupWarning } from './pluginBuild/pluginSuppressRollupWarning.js'
import { pluginDistFileNames } from './pluginBuild/pluginDistFileNames.js'
import { pluginAutoFullBuild } from './pluginBuild/pluginAutoFullBuild.js'
import { pluginBuildEntry } from './pluginBuild/pluginBuildEntry.js'
import { pluginBuildConfig } from './pluginBuild/pluginBuildConfig.js'
import { pluginModuleBanner } from './pluginBuild/pluginModuleBanner.js'

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
