export { serializePageContextClientSide }
export { serializePageContextAbort }
export type { PageContextSerialization }

import { stringify } from '@brillout/json-serializer/stringify'
import { assert, assertWarning, hasProp, unique } from '../utils.js'
import type { PageConfig } from '../../../shared/page-configs/PageConfig.js'
import { isErrorPage } from '../../../shared/error-page.js'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps.js'
import pc from '@brillout/picocolors'
import { notSerializable } from '../../../shared/notSerializable.js'
import type { UrlRedirect } from '../../../shared/route/abort.js'

const PASS_TO_CLIENT: string[] = [
  'abortReason',
  '_urlRewrite',
  '_urlRedirect',
  '_abortStatusCode',
  '_abortCall',
  '_abortCaller',
  '_pageContextInitHasClientData',
  '_pageId'
]
const PASS_TO_CLIENT_ERROR_PAGE = ['pageProps', 'is404', '_isError']

type PageContextSerialization = {
  _pageId: string
  _passToClient: string[]
  _pageConfigs: PageConfig[]
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
        assert(hasProp(err, 'message', 'string'))
        assertWarning(
          false,
          [
            `${varName} cannot be serialized and, therefore, cannot be passed to the client.`,
            `Make sure that ${varName} is serializable, or remove ${h(propName)} from ${h('passToClient')}.`,
            `Serialization error: ${lowercaseFirstLetter(err.message)}`
          ].join(' '),
          { onlyOnce: false }
        )
      }
    })
    assert(hasWarned)
    propsNonSerializable.forEach((prop) => {
      pageContextClient[prop] = notSerializable
    })
    pageContextSerialized = serialize(pageContextClient)
  }

  return pageContextSerialized
}
function serialize(value: unknown, varName?: string): string {
  return stringify(value, { forbidReactElements: true, valueName: varName })
}
function getPassToClient(pageContext: {
  _pageId: string
  _passToClient: string[]
  _pageConfigs: PageConfig[]
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
    ({ _urlRedirect: UrlRedirect } | { _urlRewrite: string } | { _abortStatusCode: number })
): string {
  assert(pageContext._urlRedirect || pageContext._urlRewrite || pageContext._abortStatusCode)
  ;['_abortCall', '_abortCaller'].forEach((p) => {
    assert(pageContext[p])
  })
  const unknownProps = Object.keys(pageContext).filter(
    (prop) =>
      ![
        '_abortCall',
        '_abortCaller',
        '_urlRedirect',
        '_urlRewrite',
        '_abortStatusCode',
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

function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
