export { getExportNames }
export { getImportStatements }
export type { ImportStatement }

import { init, parse } from 'es-module-lexer'

type ParseResult = ReturnType<typeof parse>
type ImportStatement = ParseResult[0][0]

async function getExportNames(src: string): Promise<string[]> {
  const parseResult = await parseEsModule(src)
  const exportNames = parseResult[1]
  return Array.from(exportNames)
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
