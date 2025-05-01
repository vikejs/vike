export { isScriptFile }
export { isPlainScriptFile }
export { isTemplateFile }
export { scriptFileExtensions }
export { scriptFileExtensionList }

// We can't use a RegExp:
//  - Needs to work with Micromatch: https://github.com/micromatch/micromatch because:
//    - Vite's `import.meta.glob()` uses Micromatch
//  - We need this to be a allowlist because:
//   - A pattern `*([a-zA-Z0-9]` doesn't work.
//     - Because of ReScript: `.res` are ReScript source files which need to be ignored. (The ReScript compiler generates `.js` files alongside `.res` files.)
//   - Block listing doesn't work.
//     - We cannot implement a blocklist with a glob pattern.
//     - A post `import.meta.glob()` blocklist filtering doesn't work because Vite would still process the files (e.g. including them in the bundle).

// prettier-ignore
// biome-ignore format:
const extJs = [
  'js',
  'cjs',
  'mjs',
] as const
// prettier-ignore
// biome-ignore format:
const extTs = [
  'ts',
  'cts',
  'mts',
] as const
const extJsOrTs = [...extJs, ...extTs] as const

// prettier-ignore
// biome-ignore format:
const extJsx = [
  'jsx',
  'cjsx',
  'mjsx',
] as const
// prettier-ignore
// biome-ignore format:
const extTsx = [
  'tsx',
  'ctsx',
  'mtsx'
] as const
const extJsxOrTsx = [...extJsx, ...extTsx] as const

// prettier-ignore
// biome-ignore format:
const extTemplates = [
  'vue',
  'svelte',
  'marko',
  'md',
  'mdx'
] as const

const scriptFileExtensionList = [...extJsOrTs, ...extJsxOrTsx, ...extTemplates] as const
const scriptFileExtensions: string = '(' + scriptFileExtensionList.join('|') + ')'

function isScriptFile(filePath: string): boolean {
  return scriptFileExtensionList.some((ext) => filePath.endsWith('.' + ext))
}

function isPlainScriptFile(filePath: string) {
  return extJsOrTs.some((ext) => filePath.endsWith('.' + ext))
}

function isTemplateFile(filePath: string) {
  return extTemplates.some((ext) => filePath.endsWith('.' + ext))
}
