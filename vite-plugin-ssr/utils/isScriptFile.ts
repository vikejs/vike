export { isScriptFile }
export { isTemplateFile }
export { scriptFileExtensions }
export { scriptFileExtensionList }

import { assert } from './assert.js'

// We can't use a RegExp:
//  - Needs to work with Micromatch: https://github.com/micromatch/micromatch because:
//    - Vite's `import.meta.glob()` uses Micromatch
//  - We need this to be a whitelist because:
//   - A pattern `*([a-zA-Z0-9]` doesn't work.
//     - Because of ReScript: `.res` are ReScript source files which need to be ignored. (The ReScript compiler generates `.js` files alongside `.res` files.)
//   - Black listing doesn't work.
//     - We cannot implement a blacklist with a glob pattern.
//     - A post `import.meta.glob()` blacklist filtering doesn't work because Vite would still process the files (e.g. including them in the bundle).

// prettier-ignore
const extJavaScript = [
  'js',
  'ts',
  'cjs',
  'cts',
  'mjs',
  'mts',
  'jsx',
  'tsx',
  'cjsx',
  'ctsx',
  'mjsx',
  'mtsx',
] as const
// prettier-ignore
const extTemplates = [
  'vue',
  'svelte',
  'marko',
  'md',
  'mdx'
] as const
const scriptFileExtensionList = [...extJavaScript, ...extTemplates] as const
const scriptFileExtensions: string = '(' + scriptFileExtensionList.join('|') + ')'

function isScriptFile(filePath: string): boolean {
  const yes = scriptFileExtensionList.some((ext) => filePath.endsWith('.' + ext))
  assert(!isJavaScriptFile(filePath) || yes)
  return yes
}

function isJavaScriptFile(filePath: string) {
  return /\.(c|m)?(j|t)sx?$/.test(filePath)
}

function isTemplateFile(filePath: string) {
  return extTemplates.some((ext) => filePath.endsWith('.' + ext))
}
