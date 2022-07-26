export { getExportNames }
export { getImportStatements }
export type { ImportStatement }

import { init, parse } from 'es-module-lexer'

type ParseResult = ReturnType<typeof parse>
type ImportStatement = ParseResult[0][0]

async function getExportNames(src: string): Promise<{ hasReExports: boolean; exportNames: string[] }> {
  const parseResult = await parseEsModule(src)
  const [imports, exports] = parseResult

  const exportNames = Array.from(exports)

  // This seems to be the only way to detect re-exports
  //  - https://github.com/brillout/es-module-lexer_tests
  //  - https://github.com/vitejs/vite/blob/8469bf0a5e38cbf08ec28e598ab155d339edc442/packages/vite/src/node/optimizer/index.ts#L978-L981
  const hasReExports = imports.some(({ ss, se }) => {
    const exp = src.slice(ss, se)
    return /export\s+\*\s+from/.test(exp)
  })

  return { hasReExports, exportNames }
}

async function getImportStatements(src: string): Promise<ImportStatement[]> {
  const parseResult = await parseEsModule(src)
  const imports = parseResult[0].slice()
  return imports
}

async function parseEsModule(src: string) {
  await init
  return parse(src)
}
