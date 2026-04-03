export { getDeployConfigs }

import type { fromVike } from 'convert-route'
import { assert, assertUsage, assertWarning } from '../../../../utils/assert.js'
import { isObject } from '../../../../utils/isObject.js'
import type { PageConfigPublicWithRoute } from '../../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import '../../assertEnvVite.js'
import { isCallable } from '../../../../utils/isCallable.js'

function getDeployConfigs(pageId: string, page: PageConfigPublicWithRoute) {
  const { route } = page
  if (!route) return null

  // Vercel setting: +edge
  const { edge } = page.config
  if (edge) {
    assertUsage(typeof edge === 'boolean', '+edge must be a boolean')
  }

  // Vercel setting: +isr
  let { isr } = page.config
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
      `The route of the page ${pageId} is defined via a Route Function — ${configName} isn't supported. Remove ${configName} or define the page's route using a Route String (or Filesytem Routing) instead of a Route Function.`
    assertWarning(!isr, errMsg('+isr'), { onlyOnce: true })
    assertWarning(!edge, errMsg('+edge'), { onlyOnce: true })
    return null
  }

  return {
    route,
    // route: [...new Set([...toRou3(routeIr), ...getRoutePageContextJson(routeIr)])],
    // Supported by vite-plugin-vercel@11
    vercel: { isr, edge },
  }
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
