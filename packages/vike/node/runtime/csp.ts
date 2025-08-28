export { resolvePageContextCspNone }
export { inferNonceAttr }
export { addCspResponseHeader }
export type { PageContextCspNonce }

import { import_ } from '@brillout/import'
import { assert } from './utils.js'
import type { VikeConfigPublicPageLazyLoaded } from '../../shared/getPageFiles.js'
import type { PageContextServer } from '../../types/PageContext.js'

async function resolvePageContextCspNone(
  pageContext: VikeConfigPublicPageLazyLoaded & Partial<PageContextCspNonce>,
): Promise<{ cspNonce: null | string }> {
  const pageContextAddendum = { cspNonce: null as null | string }
  if (pageContext.cspNonce) return pageContextAddendum // already set by user e.g. `renderPage({ cspNonce: '123456789' })`
  const { csp } = pageContext.config
  if (!csp?.nonce) return pageContextAddendum
  if (csp.nonce === true) {
    pageContextAddendum.cspNonce = await generateNonce()
  } else {
    pageContextAddendum.cspNonce = await csp.nonce(pageContext as any)
  }
  return pageContextAddendum
}

// Generate a cryptographically secure nonce for Content Security Policy (CSP).
// Returns a base64url-encoded nonce string (URL-safe, no padding).
// https://github.com/vikejs/vike/issues/1554#issuecomment-3181128304
async function generateNonce(): Promise<string> {
  let cryptoModule: Awaited<typeof import('crypto')>
  try {
    cryptoModule = (await import_('crypto')).default as Awaited<typeof import('crypto')>
  } catch {
    return Math.random().toString(36).substring(2, 18)
  }
  return cryptoModule.randomBytes(16).toString('base64url')
}

type PageContextCspNonce = Pick<PageContextServer, 'cspNonce'>
function inferNonceAttr(pageContext: PageContextCspNonce): string {
  const nonceAttr = pageContext.cspNonce ? ` nonce="${pageContext.cspNonce}"` : ''
  return nonceAttr
}

function addCspResponseHeader(pageContext: PageContextCspNonce, headersResponse: Headers) {
  assert(pageContext.cspNonce === null || typeof pageContext.cspNonce === 'string') // ensure resolvePageContextCspNone() is called before addCspResponseHeader()
  if (!pageContext.cspNonce) return
  if (headersResponse.get('Content-Security-Policy')) return
  headersResponse.set('Content-Security-Policy', `script-src 'self' 'nonce-${pageContext.cspNonce}'`)
}
