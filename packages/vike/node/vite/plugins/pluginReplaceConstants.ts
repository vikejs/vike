export { pluginReplaceConstants }
export { filterFunction }
export { filterRolldown }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertPosixPath } from '../utils.js'
import { normalizeId } from '../shared/normalizeId.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
import { getMagicString } from '../shared/getMagicString.js'

const skipNodeModules = '/node_modules/'
const skipIrrelevant = 'import.meta.env.'
const filterRolldown = {
  id: {
    exclude: `**${skipNodeModules}**`,
  },
  code: {
    include: skipIrrelevant,
  },
}
const filterFunction = (id: string, code: string) => {
  if (id.includes(skipNodeModules)) return false
  if (!code.includes(skipIrrelevant)) return false
  return true
}

function pluginReplaceConstants(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vike:pluginReplaceConstants',
    enforce: 'post',
    apply: 'build',
    configResolved: {
      handler(config_) {
        config = config_
      },
    },
    transform: {
      filter: filterRolldown,
      handler(code, id, options) {
        id = normalizeId(id)
        assertPosixPath(id)
        assertPosixPath(config.root)
        if (!id.startsWith(config.root)) return // skip linked dependencies
        assert(filterFunction(id, code))
        const isBuild = config.command === 'build'
        assert(isBuild)

        // Used by vike.dev
        // https://github.com/vikejs/vike/blob/08a1ff55c80ddca64ca6d4417fefd45fefeb4ffb/docs/vite.config.ts#L12
        // @ts-expect-error
        if (config._skipVikeReplaceConstants?.(id)) return

        const { magicString, getMagicStringResult } = getMagicString(code, id)

        const constantsMap: { constants: string[]; replacement: unknown }[] = []
        constantsMap.push({
          constants: [
            'pageContext.isClientSide',
            'globalContext.isClientSide',
            'pageContext.globalContext.isClientSide',
          ],
          replacement: !isViteServerSide_extraSafe(config, this.environment, options),
        })

        constantsMap.forEach(({ constants, replacement }) => {
          if (!constants.some((c) => code.includes(c))) return
          const regExp = getConstantRegExp(constants)
          magicString.replaceAll(regExp, JSON.stringify(replacement))
        })

        if (!magicString.hasChanged()) return null

        return getMagicStringResult()
      },
    },
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
