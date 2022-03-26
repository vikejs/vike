import { assert, assertWarning, isPlainObject } from './utils'

export { matchRouteString }

function matchRouteString(routeString: string, urlPathname: string): null | { routeParams: Record<string, string> } {
  const match = matchPath({ path: routeString, caseSensitive: true }, urlPathname)
  if (!match) {
    return null
  }
  const routeParams = match.params
  assert(isPlainObject(routeParams))
  return { routeParams }
}

// `matchPath()` is copied from https://github.com/remix-run/react-router/blob/34e25c1f0d20d083205469411eee0c5863748abf/packages/react-router/index.tsx#L1031

// See https://reactrouter.com/web/api/matchPath

/**
 * Performs pattern matching on a URL pathname and returns information about
 * the match.
 */
function matchPath(pattern: PathPattern | string, pathname: string) {
  if (typeof pattern === 'string') {
    pattern = { path: pattern, caseSensitive: false, end: true }
  }

  let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end)

  let match = pathname.match(matcher)
  if (!match) return null

  let matchedPathname = match[0]!
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, '$1')
  let captureGroups = match.slice(1)
  let params: Record<string, string> = paramNames.reduce<Record<string, string>>((memo, paramName, index) => {
    // We need to compute the pathnameBase here using the raw splat value
    // instead of using params["*"] later because it will be decoded then
    if (paramName === '*') {
      let splatValue = captureGroups[index] || ''
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, '$1')
    }

    memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || '', paramName)
    return memo
  }, {})

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
  }
}

function compilePath(path: string, caseSensitive = false, end = true): [RegExp, string[]] {
  assertWarning(
    path === '*' || !path.endsWith('*') || path.endsWith('/*'),
    `Route path "${path}" will be treated as if it were ` +
      `"${path.replace(/\*$/, '/*')}" because the \`*\` character must ` +
      `always follow a \`/\` in the pattern. To get rid of this warning, ` +
      `please change the route path to "${path.replace(/\*$/, '/*')}".`,
    { onlyOnce: true },
  )

  let paramNames: string[] = []
  let regexpSource =
    '^' +
    path
      .replace(/\/*\*?$/, '') // Ignore trailing / and /*, we'll handle it below
      .replace(/^\/*/, '/') // Make sure it has a leading /
      .replace(/[\\.*+^$?{}|()[\]]/g, '\\$&') // Escape special regex chars
      .replace(/:(\w+)/g, (_: string, paramName: string) => {
        paramNames.push(paramName)
        return '([^\\/]+)'
      })

  if (path.endsWith('*')) {
    paramNames.push('*')
    regexpSource +=
      path === '*' || path === '/*'
        ? '(.*)$' // Already matched the initial /, just match the rest
        : '(?:\\/(.+)|\\/*)$' // Don't include the / in params["*"]
  } else {
    regexpSource += end
      ? '\\/*$' // When matching to the end, ignore trailing slashes
      : // Otherwise, at least match a word boundary. This restricts parent
        // routes to matching only their own words and nothing more, e.g. parent
        // route "/home" should not match "/home2".
        '(?:\\b|$)'
  }

  let matcher = new RegExp(regexpSource, caseSensitive ? undefined : 'i')

  return [matcher, paramNames]
}

function safelyDecodeURIComponent(value: string, paramName: string) {
  try {
    return decodeURIComponent(value)
  } catch (error) {
    assertWarning(
      false,
      `The value for the URL param "${paramName}" will not be decoded because` +
        ` the string "${value}" is a malformed URL segment. This is probably` +
        ` due to a bad percent encoding (${error}).`,
      { onlyOnce: true },
    )

    return value
  }
}

interface PathPattern {
  /**
   * A string to match against a URL pathname. May contain `:id`-style segments
   * to indicate placeholders for dynamic parameters. May also end with `/*` to
   * indicate matching the rest of the URL pathname.
   */
  path: string
  /**
   * Should be `true` if the static portions of the `path` should be matched in
   * the same case.
   */
  caseSensitive?: boolean
  /**
   * Should be `true` if this pattern should match the entire URL pathname.
   */
  end?: boolean
}
