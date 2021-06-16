import { assertUsage } from '../utils'

export { getPageContextProxy }

const SKIP = ['then']

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
          .filter((prop) => !['pageId', 'Page'].includes(prop))
          .map((prop) => `"${prop}"`)
          .join(',')}]\`.)`
      ].join(' ')
    )
  }
}
