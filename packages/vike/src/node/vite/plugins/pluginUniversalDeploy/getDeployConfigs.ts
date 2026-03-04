import pc from '@brillout/picocolors'

export { getDeployConfigs }

import { assertUsage, assertWarning } from '../../../../utils/assert.js'
import type { PageConfigPublicWithRoute } from '../../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import '../../assertEnvVite.js'

function getDeployConfigs(pageId: string, page: PageConfigPublicWithRoute) {
  // Convert Vike's routes to rou3 format
  const route = typeof page.route === 'string' ? getParametrizedRoute(page.route) : null

  // Vercel specific configs
  const rawIsr = extractIsr(page.config)
  let isr = assertIsr(rawIsr)
  const edge = extractEdge(page.config)
  const isrOrEdge = isr ? 'isr' : edge ? 'edge' : null

  if (typeof page.route === 'function' && isrOrEdge) {
    assertWarning(
      false,
      `Page ${pageId}: ${pc.cyan(isrOrEdge)} is not supported when using route function. Remove ${pc.cyan(isrOrEdge)} config or use a route string if possible.`,
      { onlyOnce: true },
    )
    isr = null
  }

  if (edge && rawIsr !== null && typeof rawIsr === 'object') {
    assertUsage(
      false,
      `Page ${pageId}: ISR cannot be enabled for edge functions. Remove ${pc.cyan('isr')} config or set \`{ edge: false }\`.`,
    )
  }

  if (isrOrEdge && route) {
    return {
      route,
      vercel: {
        isr: isr ? { expiration: isr } : undefined,
        edge: Boolean(edge),
      },
    }
  }

  return null
}

function getSegmentRou3(segment: string): string {
  if (segment.startsWith('@')) {
    return `/:${segment.slice(1)}`
  }
  if (segment === '*') {
    return '/**'
  }
  return `/${segment}`
}

function getParametrizedRoute(route: string): string {
  const segments = (route.replace(/\/$/, '') || '/').slice(1).split('/')
  return segments.map(getSegmentRou3).join('')
}

function extractIsr(exports: unknown) {
  if (exports === null || typeof exports !== 'object') return null
  if (!('isr' in exports)) return null
  const isr = (exports as { isr: unknown }).isr

  assertUsage(
    typeof isr === 'object' &&
      typeof (isr as Record<string, unknown>).expiration === 'number' &&
      (
        isr as {
          expiration: number
        }
      ).expiration > 0,
    ' `{ expiration }` must be a positive number',
  )

  return isr
}

function assertIsr(isr: object | null | undefined): number | null {
  if (isr === null || isr === undefined) return null

  return (
    isr as {
      expiration: number
    }
  ).expiration
}

function extractEdge(exports: unknown): boolean | null {
  if (exports === null || typeof exports !== 'object') return null
  if (!('edge' in exports)) return null
  const edge = (exports as { edge: unknown }).edge

  assertUsage(typeof edge === 'boolean', ' `{ edge }` must be a boolean')

  return edge
}
