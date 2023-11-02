export { serializePageContextClientSide }
export { serializePageContextAbort }
export type { PageContextSerialization }

import { stringify, isJsonSerializerError } from '@brillout/json-serializer/stringify'
import { assert, assertWarning, hasProp, unique } from '../utils.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { isErrorPage } from '../../../shared/error-page.js'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps.js'
import pc from '@brillout/picocolors'
import { notSerializable } from '../../../shared/notSerializable.js'
import type { UrlRedirect } from '../../../shared/route/abort.js'

const PASS_TO_CLIENT: string[] = [
  'abortReason',
  '_urlRewrite',
  '_urlRedirect',
  'abortStatusCode',
  '_abortCall',
  /* Not needed on the client-side
  '_abortCaller',
  */
  '_pageContextInitHasClientData',
  '_pageId'
]
const PASS_TO_CLIENT_ERROR_PAGE = ['pageProps', 'is404', '_isError']

type PageContextSerialization = {
  _pageId: string
  _passToClient: string[]
  _pageConfigs: PageConfigRuntime[]
  is404: null | boolean
  pageProps?: Record<string, unknown>
  _isError?: true
  _pageContextInit: Record<string, unknown>
}
function serializePageContextClientSide(pageContext: PageContextSerialization) {
  const passToClient = getPassToClient(pageContext)
  const pageContextClient: Record<string, unknown> = {}
  passToClient.forEach((prop) => {
    // We set non-existing props to `undefined`, in order to pass the list of passToClient values to the client-side
    pageContextClient[prop] = (pageContext as Record<string, unknown>)[prop]
  })
  if (Object.keys(pageContext._pageContextInit).some((p) => passToClient.includes(p))) {
    pageContextClient._pageContextInitHasClientData = true
  }

  let pageContextSerialized: string
  try {
    pageContextSerialized = serialize(pageContextClient)
  } catch (err) {
    const h = (s: string) => pc.cyan(s)
    let hasWarned = false
    const propsNonSerializable: string[] = []
    passToClient.forEach((prop) => {
      const propName = JSON.stringify(prop)
      const varName = h(`pageContext[${propName}]`)
      try {
        serialize((pageContext as Record<string, unknown>)[prop], varName)
      } catch (err) {
        hasWarned = true
        propsNonSerializable.push(prop)
        let msg = [
          `${varName} cannot be serialized and, therefore, cannot be passed to the client.`,
          `Make sure that ${varName} is serializable, or remove ${h(propName)} from ${h('passToClient')}.`
        ].join(' ')
        if (isJsonSerializerError(err)) {
          msg = `${msg} Serialization error: ${err.messageCore}.`
        } else {
          // When a property getter throws an error
          console.warn('Serialization error:')
          console.warn(err)
          msg = `${msg} The serialization failed because of the error printed above.`
        }
        // We warn (instead of throwing an error) since Vike's client runtime throws an error (with `assertUsage()`) if the user's client code tries to access the property that cannot be serialized
        assertWarning(false, msg, { onlyOnce: false })
      }
    })
    assert(hasWarned)
    propsNonSerializable.forEach((prop) => {
      pageContextClient[prop] = notSerializable
    })
    try {
      pageContextSerialized = serialize(pageContextClient)
    } catch (err) {
      assert(false)
    }
  }

  return pageContextSerialized
}
function serialize(value: unknown, varName?: string): string {
  return stringify(value, { forbidReactElements: true, valueName: varName })
}
function getPassToClient(pageContext: {
  _pageId: string
  _passToClient: string[]
  _pageConfigs: PageConfigRuntime[]
  is404: null | boolean
}): string[] {
  let passToClient = [...pageContext._passToClient, ...PASS_TO_CLIENT]
  if (isErrorPage(pageContext._pageId, pageContext._pageConfigs)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
    passToClient.push(...PASS_TO_CLIENT_ERROR_PAGE)
  }
  passToClient = unique(passToClient)
  return passToClient
}

function serializePageContextAbort(
  pageContext: Record<string, unknown> &
    ({ _urlRedirect: UrlRedirect } | { _urlRewrite: string } | { abortStatusCode: number })
): string {
  assert(pageContext._urlRedirect || pageContext._urlRewrite || pageContext.abortStatusCode)
  assert(pageContext._abortCall)
  assert(pageContext._abortCaller)
  // Not needed on the client-side
  delete pageContext._abortCaller
  const unknownProps = Object.keys(pageContext).filter(
    (prop) =>
      ![
        // prettier-ignore
        '_abortCall',
        /* Not needed on the client-side
        '_abortCaller',
        */
        '_urlRedirect',
        '_urlRewrite',
        'abortStatusCode',
        'abortReason',
        'is404',
        'pageProps'
      ].includes(prop)
  )
  if (!pageContext._isLegacyRenderErrorPage) {
    assert(unknownProps.length === 0)
  } else {
    // TODO/v1-release: remove
    assertWarning(
      unknownProps.length === 0,
      [
        "The following pageContext values won't be available on the client-side:",
        unknownProps.map((p) => `  pageContext[${JSON.stringify(p)}]`),
        'Use `throw render()` instead of `throw RenderErrorPage()`'
      ].join('\n'),
      {
        onlyOnce: false
      }
    )
  }
  return serialize(pageContext)
}
