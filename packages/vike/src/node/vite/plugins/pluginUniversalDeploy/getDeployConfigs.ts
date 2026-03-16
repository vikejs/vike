import pc from '@brillout/picocolors'

export { getDeployConfigs }

import { fromVike, toRou3 } from 'convert-route'
import { assert, assertUsage, assertWarning } from '../../../../utils/assert.js'
import type { PageConfigPublicWithRoute } from '../../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import '../../assertEnvVite.js'

function getDeployConfigs(pageId: string, page: PageConfigPublicWithRoute) {
  // Convert Vike's routes to rou3 format
  const routeIr = typeof page.route === 'string' ? fromVike(page.route) : null

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

  if (isrOrEdge && routeIr) {
    return {
      route: [...new Set([...toRou3(routeIr), ...getPageContextRoute(routeIr)])],
      // Supported by vite-plugin-vercel@11
      vercel: {
        isr: isr ? { expiration: isr } : undefined,
        edge: Boolean(edge),
      },
    }
  }

  return null
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

function getPageContextRoute(routeIr: ReturnType<typeof fromVike>) {
  const lastSegment = routeIr.pathname.at(-1)
  assert(lastSegment)
  if (!lastSegment.catchAll) {
    const pageContextIr = {
      pathname: [
        ...routeIr.pathname.slice(0, -1),
        {
          ...lastSegment,
          value: `${lastSegment.value}.pageContext.json`,
        },
      ],
    }

    return toRou3(pageContextIr)
  }
  return []
}
