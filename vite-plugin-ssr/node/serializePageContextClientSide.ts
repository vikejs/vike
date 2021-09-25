import { stringify } from '@brillout/json-s'
import * as _devalue from 'devalue'
import { assert, assertUsage, hasProp, isPlainObject } from '../shared/utils'
const devalue = _devalue as any as (arg: unknown) => string

export { serializePageContextClientSide }

type PageContextUser = Record<string, unknown>
type PageContextClient = { _pageId: string } & Record<string, unknown>

function serializePageContextClientSide(
  pageContext: { _pageId: string; _passToClient: string[] },
  type: 'json' | 'inlineScript'
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

  assert(['json', 'inlineScript'].includes(type))
  const serialize: (thing: unknown) => string = (() => {
    if (type === 'json') {
      return stringify
    }
    if (type === 'inlineScript') {
      return devalue
    }
    assert(false)
  })()
  const serializerName = type === 'json' ? '@brillout/json-s' : 'devalue'
  const serializerRepo =
    type === 'json' ? 'https://github.com/brillout/json-s' : 'https://github.com/Rich-Harris/devalue'

  const pageContextClientWrapper = (() => {
    if (type === 'inlineScript') {
      return pageContextClient
    }
    if (type === 'json') {
      return { pageContext: pageContextClient }
    }
    assert(false)
  })()

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
