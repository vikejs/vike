import { stringify } from '@brillout/json-s'
import { assert, assertUsage, hasProp, isPlainObject } from '../shared/utils'

export { serializePageContextClientSide }

type PageContextUser = Record<string, unknown>
type PageContextClient = { _pageId: string } & Record<string, unknown>

function serializePageContextClientSide(
  pageContext: { _pageId: string; _passToClient: string[] }
) {
  const pageContextClient: PageContextClient = { _pageId: pageContext._pageId }
  pageContext._passToClient.forEach((prop) => {
    pageContextClient[prop] = (pageContext as PageContextUser)[prop]
  })
  if (hasProp(pageContext, '_serverSideErrorWhileStreaming')) {
    assert(pageContext._serverSideErrorWhileStreaming === true)
    pageContextClient['_serverSideErrorWhileStreaming'] = true
  }

  assert(isPlainObject(pageContextClient))
  let pageContextSerialized: string

  const serialize: (thing: unknown) => string = stringify
  const serializerName = '@brillout/json-s'
  const serializerRepo = 'https://github.com/brillout/json-s'

  const pageContextClientWrapper = { pageContext: pageContextClient }

  try {
    pageContextSerialized = serialize(pageContextClientWrapper)
  } catch (err) {
    pageContext._passToClient.forEach((prop) => {
      try {
        serialize((pageContext as Record<string, unknown>)[prop])
      } catch (err) {
        console.error(err)
        assertUsage(
          false,
          `\`pageContext['${prop}']\` can not be serialized, and it therefore cannot not passed to the client. Either remove \`'${prop}'\` from \`passToClient\` or make sure that \`pageContext['${prop}']\` is serializable. The \`${serializerName}\` serialization error is shown above (serialization is done with ${serializerRepo}).`
        )
      }
    })
    console.error(err)
    assert(false)
  }

  return pageContextSerialized
}
