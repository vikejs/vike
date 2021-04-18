import { assertUsage } from '../utils'

export { getContextPropsProxy }

function getContextPropsProxy(contextProps: Record<string, unknown>) {
  return new Proxy(contextProps, { get })

  function get(_: never, prop: string) {
    if (prop in contextProps) return contextProps[prop]
    assertUsage(
      false,
      [
        `\`contextProps.${prop}\` is not available on the client.`,
        `Make sure that \`passToClient.includes('${prop}')\`.`,
        `(Currently: \`passToClient == [${Object.keys(contextProps)
          .map((prop) => `"${prop}"`)
          .join(',')}]\`.)`
      ].join(' ')
    )
  }
}
