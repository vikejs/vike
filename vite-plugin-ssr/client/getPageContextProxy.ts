import { assertUsage } from '../shared/utils'

export { getPageContextProxy }

const SKIP = [
  'then',
  'toJSON' // Vue tries to access `toJSON`
]
const BUILT_IN = ['_pageId', 'Page', 'pageExports']

function getPageContextProxy<T extends Record<string, unknown>>(pageContext: T): T {
  return new Proxy(pageContext, { get })

  function get(_: never, prop: string) {
    if (typeof prop === 'symbol') return pageContext[prop] // Vue tries to access some symbols
    if (typeof prop !== 'string') return pageContext[prop]
    if (prop.startsWith('__v_')) return pageContext[prop] // Vue internals upon `reactive(pageContext)`
    if (prop in pageContext || SKIP.includes(prop)) return pageContext[prop]
    assertUsage(
      false,
      [
        `\`pageContext.${prop}\` is not available in the browser.`,
        `Make sure that \`passToClient.includes('${prop}')\`.`,
        `(Currently: \`passToClient == [${Object.keys(pageContext)
          .filter((prop) => !BUILT_IN.includes(prop))
          .map((prop) => `'${prop}'`)
          .join(', ')}]\`.)`,
        'More infos at https://vite-plugin-ssr.com/passToClient'
      ].join(' ')
    )
  }
}
