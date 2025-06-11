export { assertArguments }

import { assert, assertUsage, assertWarning, hasProp, isObject } from '../utils.js'
import pc from '@brillout/picocolors'

function assertArguments(...args: unknown[]): void {
  const prefix = `${pc.code('renderPage(pageContextInit)')} (https://vike.dev/renderPage)` as const

  const pageContextInit = args[0]
  assertUsage(
    pageContextInit !== undefined && pageContextInit !== null,
    prefix + ` argument ${pc.cyan('pageContextInit')} is missing`,
    { showStackTrace: true },
  )
  const len = args.length
  assertUsage(len === 1, `${prefix} called with ${len} arguments but renderPage() accepts only one argument.'`, {
    showStackTrace: true,
  })

  assertUsage(
    isObject(pageContextInit),
    `${prefix} called with ${pc.code(
      `typeof pageContextInit === ${JSON.stringify(typeof pageContextInit)}`,
    )} but ${pc.code('pageContextInit')} should be an object.`,
    { showStackTrace: true },
  )

  // TODO/v1-release: remove
  if ('url' in pageContextInit) {
    assertWarning(
      false,
      '`pageContextInit.url` has been renamed to `pageContextInit.urlOriginal`: replace `renderPage({ url })` with `renderPage({ urlOriginal })`. (See https://vike.dev/migration/0.4.23 for more information.)',
      { showStackTrace: true, onlyOnce: true },
    )
    pageContextInit.urlOriginal = pageContextInit.url
    delete pageContextInit.url
  }
  assert(!('url' in pageContextInit))

  assertUsage(
    hasProp(pageContextInit, 'urlOriginal'),
    prefix + ` ${pc.cyan('pageContextInit')} is missing the property ${pc.cyan('pageContextInit.urlOriginal')}`,
    { showStackTrace: true },
  )
  const { urlOriginal } = pageContextInit
  assertUsage(
    typeof urlOriginal === 'string',
    prefix +
      ` ${pc.cyan('pageContextInit.urlOriginal')} should be a string but ${pc.cyan(
        `typeof pageContextInit.urlOriginal === ${JSON.stringify(typeof urlOriginal)}`,
      )}`,
    { showStackTrace: true },
  )
  assertUsage(
    urlOriginal.startsWith('/') || urlOriginal.startsWith('https://') || urlOriginal.startsWith('http://'),
    prefix +
      ` ${pc.cyan('pageContextInit.urlOriginal')} should start with ${pc.cyan('/')} (e.g. ${pc.cyan(
        '/product/42',
      )}), ${pc.cyan('http://')}, or ${pc.cyan('https://')} (e.g. ${pc.cyan(
        'https://example.com/product/42',
      )}), but ${pc.cyan(`pageContextInit.urlOriginal === ${JSON.stringify(urlOriginal)}`)}`,
    { showStackTrace: true },
  )

  const urlOriginalWithoutOrigin = urlOriginal.startsWith('http')
    ? urlOriginal
    : 'http://fake-origin.example.org' + urlOriginal
  try {
    // We use `new URL()` to validate the URL. (`new URL(url)` throws an error if `url` isn't a valid URL.)
    new URL(urlOriginalWithoutOrigin)
  } catch (err) {
    assertUsage(
      false,
      prefix +
        ` ${pc.cyan('pageContextInit.urlOriginal')} should be a URL but ${pc.cyan(
          `pageContextInit.urlOriginal === ${JSON.stringify(urlOriginal)}`,
        )}`,
      { showStackTrace: true },
    )
  }
}
