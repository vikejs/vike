import { init, parse } from 'es-module-lexer'

export { getExportNames }

async function getExportNames(src: string): Promise<readonly string[]> {
  await init
  const exportNames = parse(src)[1]
  return exportNames
}
