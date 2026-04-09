export { getDeployConfig }

import { fromVike } from 'convert-route/vike'
import { assert, assertUsage, assertWarning } from '../../../../utils/assert.js'
import { isObject } from '../../../../utils/isObject.js'
import type { PageConfigPublicWithRoute } from '../../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import '../../assertEnvVite.js'
import { isCallable } from '../../../../utils/isCallable.js'
import { pageContextJsonFileExtension } from '../../../../shared-server-client/getPageContextRequestUrl.js'
import type { Vercel } from '../../../../types/Config.js'
type RouteIr = ReturnType<typeof fromVike>

function getDeployConfig(pageId: string, page: PageConfigPublicWithRoute): null | { route: RouteIr[]; vercel: Vercel } {
  const { route } = page
  if (!route) return null

  // Vercel setting: +edge
  const { edge } = page.config?.vercel ?? {}
  if (edge) {
    assertUsage(typeof edge === 'boolean', '+edge must be a boolean')
  }

  // Vercel setting: +isr
  let { isr } = page.config?.vercel ?? {}
  if (isr) {
    assertUsage(isObject(isr), '+isr must be an object')
    assertUsage(typeof isr.expiration === 'number' && isr.expiration > 0, '+isr.expiration must be a positive number')
  }
  if (edge) {
    assertWarning(!isr, `Page ${pageId} — ISR isn't supported for edge functions — remove +isr or +edge`, {
      onlyOnce: true,
    })
    isr = undefined
  }

  if (!edge && !isr) return null

  if (isCallable(route)) {
    const errMsg = (configName: '+isr' | '+edge') =>
      `The route of the page ${pageId} is defined via a Route Function — ${configName} isn't supported. Remove ${configName} or define the page's route using a Route String (or Filesystem Routing) instead of a Route Function.`
    assertWarning(!isr, errMsg('+isr'), { onlyOnce: true })
    assertWarning(!edge, errMsg('+edge'), { onlyOnce: true })
    return null
  }

  const routeIr: RouteIr = fromVike(route)
  return {
    route: [routeIr, getRouteIrPageContextJson(routeIr)].filter((r) => r !== undefined),
    // Supported by vite-plugin-vercel@11
    vercel: { isr, edge },
  }
}

function getRouteIrPageContextJson(routeIr: RouteIr) {
  const lastSegment = routeIr.pathname.at(-1)
  assert(lastSegment)
  if (lastSegment.catchAll) return
  return {
    pathname: [
      ...routeIr.pathname.slice(0, -1),
      {
        ...lastSegment,
        value: lastSegment.value + pageContextJsonFileExtension,
      },
    ],
  }
}
