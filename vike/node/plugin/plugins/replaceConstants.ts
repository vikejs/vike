export { replaceConstants }

import type { Plugin, ResolvedConfig } from 'vite'
import MagicString from 'magic-string'
import { assert, assertPosixPath } from '../utils.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isViteServerBuild_safe } from '../shared/isViteServerBuild.js'
import { applyRegExpWithMagicString } from '../shared/applyRegExWithMagicString.js'

function replaceConstants(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vike:replaceConstants',
    enforce: 'post',
    apply: 'build',
    configResolved(config_) {
      config = config_
    },
    transform(code, id, options) {
      id = normalizeId(id)
      assertPosixPath(id)
      if (id.includes('/node_modules/')) return
      assertPosixPath(config.root)
      if (!id.startsWith(config.root)) return
      if (!code.includes('import.meta.env.')) return
      const isBuild = config.command === 'build'
      assert(isBuild)

      // @ts-expect-error
      if (config._skipVikeReplaceConstants) return

      const magicString = new MagicString(code)

      const constantsMap: { constants: string[]; replacement: unknown }[] = []
      constantsMap.push({
        constants: ['pageContext.isClientSide', 'globalContext.isClientSide', 'pageContext.globalContext.isClientSide'],
        replacement: !isViteServerBuild_safe(config, options)
      })

      constantsMap.forEach(({ constants, replacement }) => {
        if (!constants.some((c) => code.includes(c))) return
        const regExp = getConstantRegExp(constants)
        applyRegExpWithMagicString(magicString, regExp, replacement)
      })

      if (!magicString.hasChanged()) return null

      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true, source: id })
      }
    }
  }
}

// Copied & adapted from:
// https://github.com/rollup/plugins/blob/e1a5ef99f1578eb38a8c87563cb9651db228f3bd/packages/replace/src/index.js#L57-L67
function getConstantRegExp(constants: string[]) {
  const keys = Object.values(constants).sort(longest).map(escape)
  // const delimiters = ['\\b', '\\b(?!\\.)']
  const delimiters = ['(?<!\\.)\\b', '\\b(?!\\.)'] // Improved version, to avoid replacing `globalContext.pageContext.isClientSide` with `globalContext.false`
  const preventAssignment = false // Let's try without it first, let's see if a user complains
  const lookbehind = preventAssignment ? '(?<!\\b(?:const|let|var)\\s*)' : ''
  const lookahead = preventAssignment ? '(?!\\s*=[^=])' : ''
  const pattern = new RegExp(`${lookbehind}${delimiters[0]}(${keys.join('|')})${delimiters[1]}${lookahead}`, 'g')
  return pattern
}
function escape(str: string) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}
function longest(a: string, b: string) {
  return b.length - a.length
}
