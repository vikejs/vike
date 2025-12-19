export { transformCode as transformStaticReplace }
export type { TransformOptions as TransformStaticReplaceOptions }

/* TODO/ai

Problem: ClientOnlyComponent is still imported at snapshot-vue-dev-after but shouldn't.

Idea: create new option `transform` that enables full transformation — use it to implement following rule: if `SomeComponent` defined at __returned__.SomeComponent doesn't occur as $setup.SomeComponent then remove it from `__returned__`.

I think that should lead to ClientOnlyComponent be completely tree-shaked away
*/

import { transformAsync, type PluginItem, type NodePath } from '@babel/core'
import * as t from '@babel/types'

// ============================================================================
// Public API
// ============================================================================

/**
 * Condition to match an argument value.
 * - string starting with 'import:' matches an imported identifier
 * - { prop, equals } matches a property value inside an object argument
 * - { call, args } matches a call expression with specific arguments
 * - { member, object, property } matches a member expression like $setup["ClientOnly"]
 */
export type ArgCondition =
  | string
  | { prop: string; equals: unknown }
  | { call: string; args?: Record<number, ArgCondition> }
  | { member: true; object: string; property: string | ArgCondition }

/**
 * Target for replace operation.
 */
export type ReplaceTarget =
  | { with: unknown } // Replace the entire call expression
  | { arg: number; prop: string; with: unknown } // Replace a prop inside an object arg
  | { arg: number; with: unknown } // Replace entire argument
  | { argsFrom: number; with: unknown } // Replace all args from index onwards with a single value

/**
 * Target for remove operation.
 */
export type RemoveTarget =
  | { arg: number; prop: string } // Remove a prop inside an object arg
  | { arg: number } // Remove entire argument
  | { argsFrom: number } // Remove all args from index onwards

/**
 * Rule for function call replacement/removal.
 */
export type CallRule = {
  call: {
    /** Match criteria */
    match: {
      /**
       * Function name(s) to match.
       * - Plain string: matches function name directly (e.g., 'jsx')
       * - Import string: 'import:source:exportName' (e.g., 'import:react/jsx-runtime:jsx')
       */
      function: string | string[]
      /** Conditions on arguments: index -> condition */
      args?: Record<number, ArgCondition>
    }
    /** Replace target (optional) */
    replace?: ReplaceTarget
    /** Remove target (optional) */
    remove?: RemoveTarget
  }
}

/**
 * Rule for static replacement/removal.
 * Currently only supports function call rules, but can be extended in the future.
 *
 * @example
 * // jsx/jsxs/jsxDEV: replace children prop with null
 * {
 *   call: {
 *     match: {
 *       function: ['jsx', 'jsxs', 'jsxDEV'],
 *       args: { 0: 'import:vike-react/ClientOnly:ClientOnly' }
 *     },
 *     replace: { arg: 1, prop: 'children', with: null }
 *   }
 * }
 *
 * @example
 * // createElement: remove all children (args from index 2)
 * {
 *   call: {
 *     match: {
 *       function: 'createElement',
 *       args: { 0: 'import:vike-react/ClientOnly:ClientOnly' }
 *     },
 *     remove: { argsFrom: 2 }
 *   }
 * }
 *
 * @example
 * // ssrRenderComponent: match nested call expression and remove default slot
 * {
 *   call: {
 *     match: {
 *       function: 'import:vue/server-renderer:ssrRenderComponent',
 *       args: {
 *         0: {
 *           call: 'import:vue:unref',
 *           args: { 0: 'import:vike-vue/ClientOnly:ClientOnly' }
 *         }
 *       }
 *     },
 *     remove: { arg: 2, prop: 'default' }
 *   }
 * }
 */
export type ReplaceRule = CallRule & {
  /** Environment filter: 'client' = client only, 'server' = everything except client */
  env?: 'server' | 'client'
} // Can be extended: CallRule | VariableRule | ...

export type TransformOptions = {
  rules: ReplaceRule[]
}

// ============================================================================
// Internal types
// ============================================================================

type TransformResult = { code: string; map: any } | null

type ParsedImport = { source: string; exportName: string }

type State = {
  modified: boolean
  /** Map: localName -> { source, exportName } */
  imports: Map<string, ParsedImport>
  alreadyUnreferenced: Set<string>
}

// ============================================================================
// Main transformer
// ============================================================================

export type TransformInput = {
  code: string
  id: string
  env: string
  options: TransformOptions
}

export async function transformCode({ code, id, env, options }: TransformInput): Promise<TransformResult> {
  // 'server' means "not client" (covers ssr, cloudflare, etc.)
  const filteredRules = options.rules.filter((rule) => {
    if (!rule.env) return true
    if (rule.env === 'client') return env === 'client'
    if (rule.env === 'server') return env !== 'client'
    return false
  })

  if (filteredRules.length === 0) {
    return null
  }

  try {
    const state: State = {
      modified: false,
      imports: new Map(),
      alreadyUnreferenced: new Set(),
    }

    const result = await transformAsync(code, {
      filename: id,
      ast: true,
      sourceMaps: true,
      plugins: [collectImportsPlugin(state), applyRulesPlugin(state, filteredRules), removeUnreferencedPlugin(state)],
    })

    if (!result?.code || !state.modified) {
      return null
    }

    return { code: result.code, map: result.map }
  } catch (error) {
    console.error(`Error transforming ${id}:`, error)
    return null
  }
}

// ============================================================================
// Helpers
// ============================================================================

function parseImportString(str: string): ParsedImport | null {
  if (!str.startsWith('import:')) return null
  const rest = str.slice('import:'.length)
  const parts = rest.split(':')
  const exportName = parts.pop()!
  const source = parts.join(':')
  return { source, exportName }
}

function valueToAst(value: unknown): t.Expression {
  if (value === null) return t.nullLiteral()
  if (value === undefined) return t.identifier('undefined')
  if (typeof value === 'string') return t.stringLiteral(value)
  if (typeof value === 'number') return t.numericLiteral(value)
  if (typeof value === 'boolean') return t.booleanLiteral(value)
  return t.callExpression(t.memberExpression(t.identifier('JSON'), t.identifier('parse')), [
    t.stringLiteral(JSON.stringify(value)),
  ])
}

function getCalleeName(callee: t.Expression | t.V8IntrinsicIdentifier): string | null {
  if (t.isIdentifier(callee)) return callee.name
  if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) return callee.property.name
  return null
}

/**
 * Check if an identifier matches an import condition
 */
function matchesImport(arg: t.Expression, parsed: ParsedImport, state: State): boolean {
  if (!t.isIdentifier(arg)) return false
  const imported = state.imports.get(arg.name)
  if (!imported) return false
  return imported.source === parsed.source && imported.exportName === parsed.exportName
}

// ============================================================================
// Babel plugins
// ============================================================================

/**
 * Collect all imports: localName -> { source, exportName }
 */
function collectImportsPlugin(state: State): PluginItem {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value

        for (const specifier of path.node.specifiers) {
          let exportName: string
          if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
            exportName = specifier.imported.name
          } else if (t.isImportDefaultSpecifier(specifier)) {
            exportName = 'default'
          } else {
            continue
          }

          state.imports.set(specifier.local.name, { source, exportName })
        }
      },
    },
  }
}

/**
 * Apply replacement rules to matching call expressions
 */
function applyRulesPlugin(state: State, rules: ReplaceRule[]): PluginItem {
  return {
    visitor: {
      CallExpression(path) {
        const calleeName = getCalleeName(path.node.callee)
        if (!calleeName) return

        for (const rule of rules) {
          if (!matchesRule(path, rule, calleeName, state)) continue
          if (rule.call.replace) {
            applyReplace(path, rule.call.replace, state)
          } else if (rule.call.remove) {
            applyRemove(path, rule.call.remove, state)
          }
        }
      },
    },
  }
}

/**
 * Check if a call expression matches a rule
 */
function matchesRule(path: NodePath<t.CallExpression>, rule: ReplaceRule, calleeName: string, state: State): boolean {
  const { match } = rule.call

  // Check callee name
  const functions = Array.isArray(match.function) ? match.function : [match.function]
  if (!matchesCallee(path.node.callee, calleeName, functions, state)) return false

  // Check argument conditions
  if (match.args) {
    for (const [indexStr, condition] of Object.entries(match.args)) {
      const index = Number(indexStr)
      const arg = path.node.arguments[index]
      if (!arg) return false

      if (!matchesCondition(arg, condition, state)) return false
    }
  }

  return true
}

/**
 * Check if callee matches any of the function patterns
 */
function matchesCallee(
  callee: t.Expression | t.V8IntrinsicIdentifier,
  calleeName: string,
  functions: string[],
  state: State,
): boolean {
  for (const fn of functions) {
    const parsed = parseImportString(fn)

    if (parsed) {
      // Import string: check if callee is an imported identifier
      if (t.isIdentifier(callee)) {
        const imported = state.imports.get(callee.name)
        if (imported && imported.source === parsed.source && imported.exportName === parsed.exportName) {
          return true
        }
      }
      // Import string: check member expression
      if (t.isMemberExpression(callee) && t.isIdentifier(callee.object) && t.isIdentifier(callee.property)) {
        const imported = state.imports.get(callee.object.name)
        if (
          imported &&
          imported.source === parsed.source &&
          imported.exportName === 'default' &&
          callee.property.name === parsed.exportName
        ) {
          return true
        }
      }
    } else {
      // Plain string: match function name directly
      if (calleeName === fn) return true
    }
  }

  return false
}

/**
 * Check if an argument matches a condition
 */
function matchesCondition(
  arg: t.ArgumentPlaceholder | t.SpreadElement | t.Expression,
  condition: ArgCondition,
  state: State,
): boolean {
  // String condition
  if (typeof condition === 'string') {
    // Import condition: 'import:source:exportName'
    const parsed = parseImportString(condition)
    if (parsed) {
      return t.isExpression(arg) && matchesImport(arg, parsed, state)
    }

    // Plain string: match string literal or identifier name
    if (t.isStringLiteral(arg)) return arg.value === condition
    if (t.isIdentifier(arg)) return arg.name === condition
    return false
  }

  // Call expression condition: match call with specific arguments
  if ('call' in condition) {
    if (!t.isCallExpression(arg)) return false

    const calleeName = getCalleeName(arg.callee)
    if (!calleeName) return false

    // Check if callee matches
    const parsed = parseImportString(condition.call)
    if (parsed) {
      // Import string: check if callee is an imported identifier
      if (!t.isIdentifier(arg.callee)) return false
      const imported = state.imports.get(arg.callee.name)
      if (!imported || imported.source !== parsed.source || imported.exportName !== parsed.exportName) {
        return false
      }
    } else {
      // Plain string: match function name directly
      if (calleeName !== condition.call) return false
    }

    // Check argument conditions
    if (condition.args) {
      for (const [indexStr, argCondition] of Object.entries(condition.args)) {
        const index = Number(indexStr)
        const nestedArg = arg.arguments[index]
        if (!nestedArg) return false
        if (!matchesCondition(nestedArg, argCondition, state)) return false
      }
    }

    return true
  }

  // Member expression condition: match $setup["ClientOnly"]
  if ('member' in condition) {
    if (!t.isMemberExpression(arg)) return false

    // Check object
    if (!t.isIdentifier(arg.object) || arg.object.name !== condition.object) return false

    // Check property
    if (typeof condition.property === 'string') {
      // Simple string property
      if (t.isIdentifier(arg.property) && !arg.computed) {
        return arg.property.name === condition.property
      }
      if (t.isStringLiteral(arg.property) && arg.computed) {
        return arg.property.value === condition.property
      }
      return false
    } else {
      // Nested condition on property (for future extensibility)
      return false
    }
  }

  // Object condition: match prop value inside an object argument
  if (!t.isObjectExpression(arg)) return false

  for (const prop of arg.properties) {
    if (!t.isObjectProperty(prop)) continue
    if (!t.isIdentifier(prop.key) || prop.key.name !== condition.prop) continue

    // Check value
    if (condition.equals === null && t.isNullLiteral(prop.value)) return true
    if (condition.equals === true && t.isBooleanLiteral(prop.value) && prop.value.value === true) return true
    if (condition.equals === false && t.isBooleanLiteral(prop.value) && prop.value.value === false) return true
    if (typeof condition.equals === 'string' && t.isStringLiteral(prop.value) && prop.value.value === condition.equals)
      return true
    if (typeof condition.equals === 'number' && t.isNumericLiteral(prop.value) && prop.value.value === condition.equals)
      return true
  }

  return false
}

/**
 * Apply a replacement to a call expression
 */
function applyReplace(path: NodePath<t.CallExpression>, replace: ReplaceTarget, state: State): void {
  // Replace the entire call expression
  if (!('arg' in replace) && !('argsFrom' in replace)) {
    path.replaceWith(valueToAst(replace.with))
    state.modified = true
    return
  }
  // Replace a prop inside an object argument
  if ('arg' in replace && 'prop' in replace) {
    const arg = path.node.arguments[replace.arg]
    if (!t.isObjectExpression(arg)) return

    for (const prop of arg.properties) {
      if (!t.isObjectProperty(prop)) continue
      if (!t.isIdentifier(prop.key) || prop.key.name !== replace.prop) continue

      prop.value = valueToAst(replace.with)
      state.modified = true
      return
    }
  }
  // Replace entire argument
  else if ('arg' in replace) {
    if (path.node.arguments.length > replace.arg) {
      path.node.arguments[replace.arg] = valueToAst(replace.with)
      state.modified = true
    }
  }
  // Replace all args from index onwards with a single value
  else if ('argsFrom' in replace) {
    if (path.node.arguments.length > replace.argsFrom) {
      path.node.arguments = [...path.node.arguments.slice(0, replace.argsFrom), valueToAst(replace.with)]
      state.modified = true
    }
  }
}

/**
 * Apply a removal to a call expression
 */
function applyRemove(path: NodePath<t.CallExpression>, remove: RemoveTarget, state: State): void {
  // Remove a prop inside an object argument
  if ('prop' in remove) {
    const arg = path.node.arguments[remove.arg]
    if (!t.isObjectExpression(arg)) return

    const index = arg.properties.findIndex((prop) => {
      // Check ObjectProperty with Identifier key
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.key) && prop.key.name === remove.prop) {
        return true
      }
      // Check ObjectMethod (getter/setter)
      if (t.isObjectMethod(prop) && t.isIdentifier(prop.key) && prop.key.name === remove.prop) {
        return true
      }
      return false
    })
    if (index !== -1) {
      arg.properties.splice(index, 1)
      state.modified = true
    }
  }
  // Remove entire argument
  else if ('arg' in remove) {
    if (path.node.arguments.length > remove.arg) {
      path.node.arguments.splice(remove.arg, 1)
      state.modified = true
    }
  }
  // Remove all args from index onwards
  else if ('argsFrom' in remove) {
    if (path.node.arguments.length > remove.argsFrom) {
      path.node.arguments = path.node.arguments.slice(0, remove.argsFrom)
      state.modified = true
    }
  }
}

/**
 * Remove unreferenced bindings after modifications
 */
function removeUnreferencedPlugin(state: State): PluginItem {
  return {
    visitor: {
      Program: {
        enter(program) {
          for (const [name, binding] of Object.entries(program.scope.bindings)) {
            if (!binding.referenced) state.alreadyUnreferenced.add(name)
          }
        },
        exit(program) {
          if (!state.modified) return
          removeUnreferenced(program, state.alreadyUnreferenced)
        },
      },
    },
  }
}

function removeUnreferenced(program: NodePath<t.Program>, alreadyUnreferenced: Set<string>): void {
  for (;;) {
    program.scope.crawl()
    let removed = false

    for (const [name, binding] of Object.entries(program.scope.bindings)) {
      if (binding.referenced || alreadyUnreferenced.has(name)) continue

      const parent = binding.path.parentPath
      if (parent?.isImportDeclaration() && parent.node.specifiers.length === 1) {
        parent.remove()
      } else {
        binding.path.remove()
      }
      removed = true
    }

    if (!removed) break
  }
}
