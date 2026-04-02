import pc from '@brillout/picocolors'

export { getDeployConfigs }

import type { fromVike } from 'convert-route'
import { assert, assertUsage, assertWarning } from '../../../../utils/assert.js'
import { isObject } from '../../../../utils/isObject.js'
import type { PageConfigPublicWithRoute } from '../../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import '../../assertEnvVite.js'
import type { ConfigResolved } from '../../../../types/index.js'

function getDeployConfigs(pageId: string, page: PageConfigPublicWithRoute) {
  const route = typeof page.route === 'string' ? page.route : null

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
      // route: [...new Set([...toRou3(routeIr), ...getRoutePageContextJson(routeIr)])],
      // Supported by vite-plugin-vercel@11
      vercel: {
        isr: isr ? { expiration: isr } : undefined,
        edge: Boolean(edge),
      },
    }
  }

  return null
}

function extractIsr(pageConfig: ConfigResolved) {
  if (!pageConfig.isr) return null
  const isr = pageConfig.isr as unknown
  assertUsage(
    isObject(isr) &&
      typeof isr.expiration === 'number' &&
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

export function getRoutePageContextJson(routeIr: ReturnType<typeof fromVike>) {
  const lastSegment = routeIr.pathname.at(-1)
  assert(lastSegment)
  if (lastSegment.catchAll) return
  return {
    pathname: [
      ...routeIr.pathname.slice(0, -1),
      {
        ...lastSegment,
        value: `${lastSegment.value}.pageContext.json`,
      },
    ],
  }
}
