export { serializePageContextClientSide }

import { stringify } from '@brillout/json-serializer/stringify'
import { assert, assertUsage, hasProp, isPlainObject, unique } from '../utils'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { isErrorPage } from '../../../shared/error-page'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps'

type PageContextUser = Record<string, unknown>
type PageContextClient = { _pageId: string } & Record<string, unknown>

const passToClientBuiltIn: string[] = ['errorReason', 'urlRewrite']
const passToClientBuiltInError = ['pageProps', 'is404', '_isError']

function serializePageContextClientSide(pageContext: {
  _pageId: string
  _passToClient: string[]
  _pageConfigs: PageConfig[]
  is404: null | boolean
  pageProps?: Record<string, unknown>
  _isError?: true
}) {
  const pageContextClient: PageContextClient = { _pageId: pageContext._pageId }

  let passToClient = [...pageContext._passToClient, ...passToClientBuiltIn]

  if (isErrorPage(pageContext._pageId, pageContext._pageConfigs)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
    passToClient.push(...passToClientBuiltInError)
  }

  passToClient = unique(passToClient)

  passToClient.forEach((prop) => {
    // We set non-existing props to `undefined`, in order to pass the list of passToClient values to the client-side
    pageContextClient[prop] = (pageContext as PageContextUser)[prop]
  })
  /*
  if (hasProp(pageContext, '_serverSideErrorWhileStreaming')) {
    assert(pageContext._serverSideErrorWhileStreaming === true)
    pageContextClient['_serverSideErrorWhileStreaming'] = true
  }
  */

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

function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
