import { stringify } from '@brillout/json-serializer/stringify'
import { isErrorPageId } from '../shared/route'
import { assert, assertUsage, hasProp, isPlainObject, unique } from './utils'

export { serializePageContextClientSide }
export { addIs404ToPageProps }

type PageContextUser = Record<string, unknown>
type PageContextClient = { _pageId: string } & Record<string, unknown>

function serializePageContextClientSide(pageContext: {
  _pageId: string
  _passToClient: string[]
  is404: null | boolean
  pageProps?: Record<string, unknown>
  _isError?: true
}) {
  const pageContextClient: PageContextClient = { _pageId: pageContext._pageId }

  let passToClient = [...pageContext._passToClient]

  if (isErrorPageId(pageContext._pageId)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
    passToClient.push(...['pageProps', 'is404', '_isError'])
  }

  passToClient = unique(passToClient)

  passToClient.forEach((prop) => {
    pageContextClient[prop] = (pageContext as PageContextUser)[prop]
  })
  if (hasProp(pageContext, '_serverSideErrorWhileStreaming')) {
    assert(pageContext._serverSideErrorWhileStreaming === true)
    pageContextClient['_serverSideErrorWhileStreaming'] = true
  }

  assert(isPlainObject(pageContextClient))
  let pageContextSerialized: string

  const pageContextClientWrapper = { pageContext: pageContextClient }

  try {
    pageContextSerialized = stringify(pageContextClientWrapper, { forbidReactElements: true })
  } catch (err) {
    passToClient.forEach((prop) => {
      const valueName = `pageContext['${prop}']`
      try {
        stringify((pageContext as Record<string, unknown>)[prop], { forbidReactElements: true, valueName })
      } catch (err) {
        assert(hasProp(err, 'message', 'string'))
        assertUsage(
          false,
          `\`${valueName}\` cannot be serialized and, therefore, cannot be passed to the client. Make sure that \`${valueName}\` is serializable or remove \`'${prop}'\` from \`passToClient\`. Serialization error: ${lowercaseFirstLetter(
            err.message
          )}`
        )
      }
    })
    console.error(err)
    assert(false)
  }

  return pageContextSerialized
}

function addIs404ToPageProps(pageContext: { is404: boolean; pageProps?: Record<string, unknown> }) {
  assert(typeof pageContext.is404 === 'boolean')
  const pageProps = pageContext.pageProps || {}
  pageProps['is404'] = pageProps['is404'] || pageContext.is404
  pageContext.pageProps = pageProps
}

function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
