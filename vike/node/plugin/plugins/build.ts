export { build }

import type { Plugin } from 'vite'
import { pluginAssetsManifest } from './build/pluginAssetsManifest.js'
import { pluginBuildApp } from './build/pluginBuildApp.js'
import { pluginDistPackageJsonFile } from './build/pluginDistPackageJsonFile.js'
import { pluginSuppressRollupWarning } from './build/pluginSuppressRollupWarning.js'
import { pluginDistFileNames } from './build/pluginDistFileNames.js'
import { pluginAutoFullBuild } from './build/pluginAutoFullBuild.js'
import { pluginBuildEntry } from './build/pluginBuildEntry.js'
import { pluginBuildSettings } from './buildConfig.js'

function build(): Plugin[] {
  return [
    ...pluginAssetsManifest(),
    ...pluginBuildSettings(),
    ...pluginBuildApp(),
    ...pluginAutoFullBuild(),
    ...pluginBuildEntry(),
    pluginDistPackageJsonFile(),
    pluginSuppressRollupWarning(),
    pluginDistFileNames()
  ]
}
