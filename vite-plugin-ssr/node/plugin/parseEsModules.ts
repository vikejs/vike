export type { EsModules }
export { parseEsModules }
export { getExportNames }

import { init, parse } from 'es-module-lexer'

type EsModules = ReturnType<typeof parse>

function getExportNames(esModuleLexerParseResult: EsModules): string[] {
  const exportNames = esModuleLexerParseResult[1]
  return Array.from(exportNames)
}

async function parseEsModules(src: string) {
  await init
  return parse(src)
}
