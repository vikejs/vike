import { assertUsage } from '../shared/utils'

export { getPageContextProxy }

const SKIP = ['then']
const BUILT_IN = ['_pageId', 'Page', 'pageExports']

function getPageContextProxy<T extends Record<string, unknown>>(pageContext: T): T {
  return new Proxy(pageContext, { get })

  function get(_: never, prop: string) {
    if (prop in pageContext || SKIP.includes(prop)) return pageContext[prop]
    assertUsage(
      false,
      [
        `\`pageContext.${prop}\` is not available on the client.`,
        `Make sure that \`passToClient.includes('${prop}')\`.`,
        `(Currently: \`passToClient == [${Object.keys(pageContext)
          .filter((prop) => !BUILT_IN.includes(prop))
          .map((prop) => `"${prop}"`)
          .join(',')}]\`.)`
      ].join(' ')
    )
  }
}
