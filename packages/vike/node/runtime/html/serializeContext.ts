export { getPageContextClientSerialized }
export { getPageContextClientSerializedAbort }
export { getGlobalContextClientSerialized }
export type { PageContextSerialization }

import { stringify, isJsonSerializerError } from '@brillout/json-serializer/stringify'
import { assert, assertUsage, assertWarning, getPropAccessNotation, hasProp, unique } from '../utils.js'
import { isErrorPage } from '../../../shared/error-page.js'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps.js'
import pc from '@brillout/picocolors'
import { NOT_SERIALIZABLE } from '../../../shared/NOT_SERIALIZABLE.js'
import type { UrlRedirect } from '../../../shared/route/abort.js'
import { pageContextInitIsPassedToClient } from '../../../shared/misc/pageContextInitIsPassedToClient.js'
import { isServerSideError } from '../../../shared/misc/isServerSideError.js'
import { getPropKeys, getPropVal, setPropVal } from './propKeys.js'
import type { GlobalContextServerInternal } from '../globalContext.js'

const passToClientBuiltInPageContext = [
  'abortReason',
  '_urlRewrite',
  '_urlRedirect',
  'abortStatusCode',
  '_abortCall',
  /* Not needed on the client-side
  '_abortCaller',
  */
  pageContextInitIsPassedToClient,
  'pageId',
  'routeParams',
  'data', // for data() hook
]
const pageToClientBuiltInPageContextError = ['pageProps', 'is404', isServerSideError]

type PageContextSerialization = {
  pageId: string
  routeParams: Record<string, string>
  _passToClient: string[]
  is404: null | boolean
  pageProps?: Record<string, unknown>
  _pageContextInit: Record<string, unknown>
  _globalContext: GlobalContextServerInternal
}
function getPageContextClientSerialized(pageContext: PageContextSerialization) {
  const passToClientPageContext = getPassToClientPageContext(pageContext)
  const pageContextClient = applyPassToClient(passToClientPageContext, pageContext)
  if (passToClientPageContext.some((prop) => getPropVal(pageContext._pageContextInit, prop))) {
    pageContextClient[pageContextInitIsPassedToClient] = true
  }
  const pageContextClientSerialized = serializeObject(pageContextClient, 'pageContext', passToClientPageContext)
  return pageContextClientSerialized
}

function getGlobalContextClientSerialized(pageContext: PageContextSerialization) {
  const passToClient = pageContext._passToClient
  const globalContextClient = applyPassToClient(passToClient, pageContext._globalContext)
  const globalContextClientSerialized = serializeObject(globalContextClient, 'globalContext', passToClient)
  return globalContextClientSerialized
}

function serializeObject(
  obj: Record<string, unknown>,
  objName: 'pageContext' | 'globalContext',
  passToClient: string[],
) {
  let serialized: string
  try {
    serialized = serializeValue(obj)
  } catch (err) {
    const h = (s: string) => pc.cyan(s)
    let hasWarned = false
    const propsNonSerializable: string[] = []
    passToClient.forEach((prop) => {
      const res = getPropVal(obj, prop)
      if (!res) return
      const { value } = res
      const varName = `${objName}${getPropKeys(prop).map(getPropAccessNotation).join('')}` as const
      try {
        serializeValue(value, varName)
      } catch (err) {
        propsNonSerializable.push(prop)

        // useConfig() wrong usage
        if (prop === '_configFromHook') {
          let pathString = ''
          if (isJsonSerializerError(err)) {
            pathString = err.pathString
          }
          // There used to be a `## Serialization Error` section in the docs but we removed it at:
          // https://github.com/vikejs/vike/commit/c9da2f577db01bd1c8f72265ff83e78484ddc2c0
          assertUsage(false, `Cannot serialize config value ${h(pathString)} set by useConfig()`)
        }

        // Non-serializable property set by the user
        let msg = [
          `${h(varName)} can't be serialized and, therefore, can't be passed to the client side.`,
          `Make sure ${h(varName)} is serializable, or remove ${h(JSON.stringify(prop))} from ${h('passToClient')}.`,
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
        hasWarned = true
      }
    })
    assert(hasWarned)
    propsNonSerializable.forEach((prop) => {
      obj[getPropKeys(prop)[0]!] = NOT_SERIALIZABLE
    })
    try {
      serialized = serializeValue(obj)
    } catch (err) {
      assert(false)
    }
  }
  return serialized
}
function serializeValue(value: unknown, varName?: `pageContext${string}` | `globalContext${string}`): string {
  return stringify(value, { forbidReactElements: true, valueName: varName })
}
function getPassToClientPageContext(pageContext: {
  pageId: string
  _passToClient: string[]
  _globalContext: GlobalContextServerInternal
  is404: null | boolean
}): string[] {
  let passToClient = [...pageContext._passToClient, ...passToClientBuiltInPageContext]
  if (isErrorPage(pageContext.pageId, pageContext._globalContext._pageConfigs)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
    passToClient.push(...pageToClientBuiltInPageContextError)
  }
  passToClient = unique(passToClient)
  return passToClient
}

function getPageContextClientSerializedAbort(
  pageContext: Record<string, unknown> &
    ({ _urlRedirect: UrlRedirect } | { _urlRewrite: string } | { abortStatusCode: number }),
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
        // biome-ignore format:
        '_abortCall',
        /* Not needed on the client-side
        '_abortCaller',
        */
        '_urlRedirect',
        '_urlRewrite',
        'abortStatusCode',
        'abortReason',
        'is404',
        'pageProps',
      ].includes(prop),
  )
  if (!pageContext._isLegacyRenderErrorPage) {
    assert(unknownProps.length === 0)
  } else {
    // TO-DO/next-major-release: remove
    assertWarning(
      unknownProps.length === 0,
      [
        "The following pageContext values won't be available on the client-side:",
        unknownProps.map((p) => `  pageContext[${JSON.stringify(p)}]`),
        'Use `throw render()` instead of `throw RenderErrorPage()`',
      ].join('\n'),
      {
        onlyOnce: false,
      },
    )
  }
  return serializeValue(pageContext)
}

function applyPassToClient(passToClient: string[], pageContext: Record<string, unknown>) {
  const pageContextClient: Record<string, unknown> = {}
  passToClient.forEach((prop) => {
    // Get value from pageContext
    const res = getPropVal(pageContext, prop)
    if (!res) return
    const { value } = res

    // Set value to pageContextClient
    setPropVal(pageContextClient, prop, value)
  })
  return pageContextClient
}
