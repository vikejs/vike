export { assertArguments }

import { assert, assertUsage, assertWarning, hasProp, isPlainObject } from '../utils.js'

function assertArguments(...args: unknown[]): void {
  const prefix = '[renderPage(pageContextInit)]'

  const pageContextInit = args[0]
  assertUsage(pageContextInit, prefix + ' argument `pageContextInit` is missing', { showStackTrace: true })
  const len = args.length
  assertUsage(len === 1, `${prefix} You passed ${len} arguments but \`renderPage()\` accepts only one argument.'`, {
    showStackTrace: true
  })

  assertUsage(
    isPlainObject(pageContextInit),
    `${prefix} \`pageContextInit\` should be a plain JavaScript object, but \`pageContextInit.constructor === ${
      (pageContextInit as any).constructor
    }\``,
    { showStackTrace: true }
  )

  if ('url' in pageContextInit) {
    assertWarning(
      false,
      '`pageContext.url` has been renamed to `pageContext.urlOriginal`: replace `renderPage({ url })` with `renderPage({ urlOriginal })`. (See https://vite-plugin-ssr.com/migration/0.4.23 for more information.)',
      { showStackTrace: true, onlyOnce: true }
    )
    pageContextInit.urlOriginal = pageContextInit.url
    delete pageContextInit.url
  }
  assert(!('url' in pageContextInit))

  assertUsage(
    hasProp(pageContextInit, 'urlOriginal'),
    prefix + ' `pageContextInit` is missing the property `pageContextInit.urlOriginal`',
    { showStackTrace: true }
  )
  assertUsage(
    typeof pageContextInit.urlOriginal === 'string',
    prefix +
      ' `pageContextInit.urlOriginal` should be a string but `typeof pageContextInit.urlOriginal === "' +
      typeof pageContextInit.urlOriginal +
      '"`.',
    { showStackTrace: true }
  )
  assertUsage(
    pageContextInit.urlOriginal.startsWith('/') || pageContextInit.urlOriginal.startsWith('http'),
    prefix +
      ' `pageContextInit.urlOriginal` should start with `/` (e.g. `/product/42`) or `http` (e.g. `http://example.org/product/42`) but `pageContextInit.urlOriginal === "' +
      pageContextInit.urlOriginal +
      '"`',
    { showStackTrace: true }
  )

  try {
    const { urlOriginal } = pageContextInit
    const urlWithOrigin = urlOriginal.startsWith('http') ? urlOriginal : 'http://fake-origin.example.org' + urlOriginal
    // We use `new URL()` to validate the URL. (`new URL(url)` throws an error if `url` isn't a valid URL.)
    new URL(urlWithOrigin)
  } catch (err) {
    assertUsage(
      false,
      prefix +
        ' `pageContextInit.urlOriginal` should be a URL but `pageContextInit.urlOriginal==="' +
        pageContextInit.urlOriginal +
        '"`.',
      { showStackTrace: true }
    )
  }
}
