export { resolvePageContextCspNone }
export { inferNonceAttr }
export { addCspResponseHeader }
export type { PageContextCspNonce }

import { import_ } from '@brillout/import'
import type { VikeConfigPublicPageLazyLoaded } from '../../shared/getPageFiles.js'
import type { PageContextServer } from '../../types/PageContext.js'

async function resolvePageContextCspNone(pageContext: VikeConfigPublicPageLazyLoaded & PageContextCspNonce) {
  if (pageContext.cspNonce) return // already set by user e.g. `renderPage({ cspNonce: '123456789' })`
  const { csp } = pageContext.config
  if (!csp?.nonce) return
  let cspNonce: string
  if (csp.nonce === true) {
    cspNonce = await generateNonce()
  } else {
    cspNonce = await csp.nonce(pageContext as any)
  }
  const pageContextAddendum = { cspNonce }
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
  if (!pageContext.cspNonce) return
  if (headersResponse.get('Content-Security-Policy')) return
  headersResponse.set('Content-Security-Policy', `script-src 'self' 'nonce-${pageContext.cspNonce}'`)
}
