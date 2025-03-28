export { isScriptFile }
export { isPlainJavaScriptFile }
export { isTemplateFile }
export { scriptFileExtensions }
export { scriptFileExtensionList }

import { assert } from './assert.js'

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
const extJavaScript = [
  'js',
  'ts',
  'cjs',
  'cts',
  'mjs',
  'mts',
]
// prettier-ignore
// biome-ignore format:
const extJsx = [
  'jsx',
  'tsx',
  'cjsx',
  'ctsx',
  'mjsx',
  'mtsx',
] as const
// prettier-ignore
// biome-ignore format:
const extTemplates = [
  'vue',
  'svelte',
  'marko',
  'md',
  'mdx'
] as const
const scriptFileExtensionList = [...extJavaScript, ...extJsx, ...extTemplates] as const
const scriptFileExtensions: string = '(' + scriptFileExtensionList.join('|') + ')'

function isScriptFile(filePath: string): boolean {
  const yes = scriptFileExtensionList.some((ext) => filePath.endsWith('.' + ext))
  if (isPlainJavaScriptFile(filePath)) assert(yes)
  return yes
}

function isPlainJavaScriptFile(filePath: string) {
  const yes1 = /\.(c|m)?(j|t)s$/.test(filePath)
  const yes2 = extJavaScript.some((ext) => filePath.endsWith('.' + ext))
  assert(yes1 === yes2)
  return yes1
}

function isTemplateFile(filePath: string) {
  return extTemplates.some((ext) => filePath.endsWith('.' + ext))
}
