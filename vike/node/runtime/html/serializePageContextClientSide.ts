export { serializePageContextClientSide }
export { serializePageContextAbort }
export type { PageContextSerialization }

import { stringify, isJsonSerializerError } from '@brillout/json-serializer/stringify'
import { assert, assertUsage, assertWarning, getPropAccessNotation, hasProp, unique } from '../utils.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { isErrorPage } from '../../../shared/error-page.js'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps.js'
import pc from '@brillout/picocolors'
import { NOT_SERIALIZABLE } from '../../../shared/NOT_SERIALIZABLE.js'
import type { UrlRedirect } from '../../../shared/route/abort.js'
import { pageContextInitIsPassedToClient } from '../../../shared/misc/pageContextInitIsPassedToClient.js'
import { isServerSideError } from '../../../shared/misc/isServerSideError.js'

const PASS_TO_CLIENT: string[] = [
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
  'data' // for data() hook
]
const PASS_TO_CLIENT_ERROR_PAGE = ['pageProps', 'is404', isServerSideError]

type PageContextSerialization = {
  pageId: string
  routeParams: Record<string, string>
  _passToClient: string[]
  _pageConfigs: PageConfigRuntime[]
  is404: null | boolean
  pageProps?: Record<string, unknown>
  _pageContextInit: Record<string, unknown>
}
function serializePageContextClientSide(pageContext: PageContextSerialization) {
  const passToClient = getPassToClient(pageContext)
  const pageContextClient = applyPassToClient(passToClient, pageContext)
  if (passToClient.some(p => getPropVal(pageContext._pageContextInit, p) !== undefined)) {
    pageContextClient[pageContextInitIsPassedToClient] = true
  }

  let pageContextSerialized: string
  try {
    pageContextSerialized = serialize(pageContextClient)
  } catch (err) {
    const h = (s: string) => pc.cyan(s)
    let hasWarned = false
    const propsNonSerializable: string[] = []
    passToClient.forEach((prop) => {
      const varName = `pageContext${getPropKeys(prop).map(getPropAccessNotation).join('')}`
      try {
        serialize(getPropVal(pageContext, prop), varName)
      } catch (err) {
        hasWarned = true
        propsNonSerializable.push(prop)

        // useConfig() wrong usage
        if (prop === '_configFromHook') {
          let pathString = ''
          if (isJsonSerializerError(err)) {
            pathString = err.pathString
          }
          assertUsage(
            false,
            `Cannot serialize config ${h(
              pathString
            )} set by useConfig(), see https://vike.dev/useConfig#serialization-error`
          )
        }

        // Non-serializable pageContext set by the user
        let msg = [
          `${h(varName)} can't be serialized and, therefore, can't be passed to the client side.`,
          `Make sure ${h(varName)} is serializable, or remove ${h(JSON.stringify(prop))} from ${h('passToClient')}.`
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
      pageContextClient[getPropKeys(prop)[0]!] = NOT_SERIALIZABLE
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
  pageId: string
  _passToClient: string[]
  _pageConfigs: PageConfigRuntime[]
  is404: null | boolean
}): string[] {
  let passToClient = [...pageContext._passToClient, ...PASS_TO_CLIENT]
  if (isErrorPage(pageContext.pageId, pageContext._pageConfigs)) {
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

function applyPassToClient(passToClient: string[], pageContext: Record<string, unknown>) {
  const pageContextClient: Record<string, unknown> = {};

  passToClient.forEach((prop) => {
    // Get the value from pageContext
    const value = getPropVal(pageContext, prop);
    // Set the value in pageContextClient
    setPropVal(pageContextClient, prop, value);
  });

  return pageContextClient;
}

/**
 * Get a nested property from an object using a dot-separated path (e.g., 'user.id').
 * Returns `undefined` if the property or any intermediate property doesn't exist.
 */
function getPropVal(obj: Record<string, unknown>, prop: string): unknown {
  const keys = getPropKeys(prop)
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return undefined; // Property or intermediate property doesn't exist
    }
  }

  return value;
}

/**
 * Set a nested property in an object using a dot-separated path (e.g., 'user.id').
 * Creates intermediate objects if they don't exist.
 */
function setPropVal(obj: Record<string, unknown>, prop: string, val: unknown): void {
  const keys = getPropKeys(prop)
  let currentObj = obj;

  // Traverse to the second-to-last key, creating intermediate objects if necessary
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    if (!currentObj[key] || typeof currentObj[key] !== 'object') {
      currentObj[key] = {}; // Create intermediate object
    }
    currentObj = currentObj[key] as Record<string, unknown>;
  }

  // Set the final key to the value
  const finalKey = keys[keys.length - 1]!;
  currentObj[finalKey] = val;
}

function getPropKeys(prop: string): string[] {
  return prop.split('.')
}
