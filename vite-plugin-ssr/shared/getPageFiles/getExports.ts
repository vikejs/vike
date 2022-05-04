export { getExportUnion }
export { getExports }
export type { ExportsAll }
export type { PageContextExports }

import { assert, hasProp, isObject, assertWarning, assertUsage, makeLast } from '../utils'
import { FileType, PageFile } from './types'

type ExportsAll = Record<
  string,
  { exportValue: unknown; filePath: string; _fileType: FileType; _isDefaultExport: boolean }[]
>
type PageContextExports = {
  exportsAll: ExportsAll
  pageExports: Record<string, unknown>
  exports: Record<string, unknown>
}

function getExports(pageFiles: PageFile[]): PageContextExports {
  const exportsAll: ExportsAll = {}
  const addExport = ({
    exportName,
    exportValue,
    filePath,
    fileType,
    isDefaultExport,
  }: {
    exportName: string
    exportValue: unknown
    fileType: FileType
    filePath: string
    isDefaultExport: boolean
  }) => {
    assert(exportName !== 'default')
    exportsAll[exportName] = exportsAll[exportName] ?? []
    exportsAll[exportName]!.push({
      exportValue,
      filePath: filePath,
      _fileType: fileType,
      _isDefaultExport: isDefaultExport,
    })
  }

  pageFiles.forEach(({ filePath, fileType, fileExports }) => {
    Object.entries(fileExports ?? {})
      .sort(makeLast(([exportName]) => exportName === 'default')) // `export { bla }` should override `export default { bla }`
      .forEach(([exportName, exportValue]) => {
        let isDefaultExport = exportName === 'default'

        if (isDefaultExport) {
          if (!isJavaScriptFile(filePath)) {
            // `.vue` and `.md` files
            exportName = 'Page'
          } else {
            assertUsage(isObject(exportValue), `The \`export default\` of ${filePath} should be an object.`)
            Object.entries(exportValue).forEach(([defaultExportName, defaultExportValue]) => {
              addExport({
                exportName: defaultExportName,
                exportValue: defaultExportValue,
                filePath,
                fileType,
                isDefaultExport,
              })
            })
            return
          }
        }

        addExport({
          exportName,
          exportValue,
          filePath,
          fileType,
          isDefaultExport,
        })
      })
  })

  const pageExports = createObjectWithDeprecationWarning()
  const exports: Record<string, unknown> = {}
  Object.entries(exportsAll).forEach(([exportName, values]) => {
    values.forEach(({ exportValue, _fileType, _isDefaultExport }) => {
      exports[exportName] = exports[exportName] ?? exportValue

      // Legacy `pageContext.pageExports`
      if (_fileType === '.page' && !_isDefaultExport) {
        if (!(exportName in pageExports)) {
          pageExports[exportName] = exportValue
        }
      }
    })
  })

  assert(!('default' in exports))
  assert(!('default' in exportsAll))

  return {
    exports,
    exportsAll,
    pageExports,
  }
}

function isJavaScriptFile(filePath: string) {
  // `.mjs`
  // `.cjs`
  // `.js`
  // `.tsx`
  // ...
  return /\.(c|m)?(j|t)sx?$/.test(filePath)
}

function createObjectWithDeprecationWarning(): Record<string, unknown> {
  return new Proxy(
    {},
    {
      get(...args) {
        assertWarning(
          false,
          '`pageContext.pageExports` is deprecated. Use `pageContext.exports` instead, see https://vite-plugin-ssr.com/exports',
          { onlyOnce: true },
        )
        return Reflect.get(...args)
      },
    },
  )
}

function getExportUnion(exportsAll: ExportsAll, propName: string): string[] {
  return (
    exportsAll[propName]
      ?.map((e) => {
        assertUsage(
          hasProp(e, 'exportValue', 'string[]'),
          `\`export { ${propName} }\` of ${e.filePath} should be an array of strings.`,
        )
        return e.exportValue
      })
      .flat() ?? []
  )
}
