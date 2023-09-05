export { loadPageCode }

import { assert, assertDefaultExportUnknown, assertUsage, objectAssign } from '../utils.js'
import type { PageConfig, PageConfigLoaded } from './PageConfig.js'
import pc from '@brillout/picocolors'

async function loadPageCode(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  if (
    pageConfig.isLoaded &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigLoaded
  }

  const codeFiles = await pageConfig.loadCodeFiles()

  // TODO: remove?
  // pageConfig.configValuesOld = pageConfig.configValuesOld.filter((val) => !val.definedByCodeFile)

  const addConfigValue = (configName: string, value: unknown, filePath: string, exportName: string) => {
    /* TODO
    assert(!isAlreadyDefined(val.configName), val.configName) // Conflicts are resolved upstream
    */
    pageConfig.configValues[configName] = {
      value,
      definedAt: {
        filePath,
        fileExportPath: [exportName]
      }
      /* TODO: remove?
      definedByCodeFile: true
      */
    }
    assertIsNotNull(value, configName, filePath)
  }

  codeFiles.forEach((codeFile) => {
    if (codeFile.isPlusFile) {
      const { codeFileExports, codeFilePath } = codeFile
      if (codeFile.configName !== 'client') {
        assertDefaultExportUnknown(codeFileExports, codeFilePath)
      }
      Object.entries(codeFileExports).forEach(([exportName, exportValue]) => {
        const isSideExport = exportName !== 'default' // .md files may have "side-exports" such as `export { frontmatter }`
        const configName = isSideExport ? exportName : codeFile.configName
        if (isSideExport && configName in pageConfig.configValues) {
          // We can't avoid side-export conflicts upstream. (Because we cannot know about side-exports upstream at build-time.)
          // Side-exports have the lowest priority.
          return
        }
        addConfigValue(configName, exportValue, codeFilePath, exportName)
      })
    } else {
      const { configName, codeFilePath, codeFileExportValue, codeFileExportName } = codeFile
      addConfigValue(configName, codeFileExportValue, codeFilePath, codeFileExportName)
    }
  })

  /* TODO Remove? Conflicts are already handled
  const codeFileExports: ({ configVal: ConfigValueOld } & (
    | { isPlusFile: true; isSideExport: boolean }
    | { isPlusFile: false; isSideExport: null }
  ))[] = []
  codeFileExports
    .sort(
      lowerFirst((codeFileExport) => {
        const { isPlusFile, isSideExport } = codeFileExport
        if (isPlusFile) {
          if (isSideExport) {
            return 2
          } else {
            return 0
          }
        } else {
          return 1
        }
      })
    )
    .forEach((codeFileExport) => {
      const alreadyDefined = configValuesOld.find(
        (configVal) => codeFileExport.configVal.configName === configVal.configName
      )
      if (!alreadyDefined) {
        configValuesOld.push(codeFileExport.configVal)
      }
    })
  */

  objectAssign(pageConfig, { isLoaded: true as const })

  return pageConfig
}

function assertIsNotNull(configValue: unknown, configName: string, codeFilePath: string) {
  assert(!codeFilePath.includes('+config.'))
  assertUsage(
    configValue !== null,
    `Set ${pc.cyan(configName)} to ${pc.cyan('null')} in a +config.h.js file instead of ${codeFilePath}`
  )
}
