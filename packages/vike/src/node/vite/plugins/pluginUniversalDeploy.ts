import { addEntry } from '@universal-deploy/store'

export { pluginUniversalDeploy }

import type { Plugin } from 'vite'
import { getVikeConfigInternal, VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import '../assertEnvVite.js'
import { catchAll, devServer } from '@universal-deploy/store/vite'
import { serverEntryVirtualId } from '@brillout/vite-plugin-server-entry/plugin'
import MagicString from 'magic-string'
import { escapeRegex } from '../../../utils/escapeRegex.js'
import { assertUsage } from '../../../utils/assert.js'

const catchAllRE = /^virtual:ud:catch-all$/

function pluginUniversalDeploy(vikeConfig: VikeConfigInternal): Plugin[] {
  return [
    {
      name: 'vike:pluginUniversalDeploy',
      async config() {
        const vikeConfig = await getVikeConfigInternal()

        for (const [pageId, page] of Object.entries(vikeConfig.pages)) {
          // Convert Vike's routes to rou3 format
          const route = typeof page.route === 'string' ? getParametrizedRoute(page.route) : null

          // FIXME refactor
          const rawIsr = extractIsr(page.config)
          let isr = assertIsr(page.config)
          const edge = assertEdge(page.config)

          if (typeof page.route === 'function' && isr) {
            // FIXME reuse Vike utils
            console.warn(
              `Page ${pageId}: ISR is not supported when using route function. Remove \`{ isr }\` config or use a route string if possible.`,
            )
            isr = null
          }

          if (edge && rawIsr !== null && typeof rawIsr === 'object') {
            // FIXME use assert
            throw new Error(
              `Page ${pageId}: ISR cannot be enabled for edge functions. Remove \`{ isr }\` config or set \`{ edge: false }\`.`,
            )
          }

          if (route) {
            addEntry({
              id: 'vike/fetch',
              route,

              vercel: {
                isr: isr ? { expiration: isr } : undefined,
                edge: Boolean(edge),
              },
            })
          }
        }

        // Default catch-all route
        addEntry({
          id: 'vike/fetch',
          route: '/**',
        })

        // TODO support multiple entry, at least where configs are different (mostly related to Vercel ISR)
        //  See https://github.com/vikejs/vike-photon/blob/438bffdb9a82650a49ee5345a82d0cc779afc3c8/packages/vike-photon/src/plugin/plugins/routes.ts#L22
        //  and https://github.com/vikejs/vike-photon/blob/438bffdb9a82650a49ee5345a82d0cc779afc3c8/packages/vike-photon/src/targets/vercel/index.ts#L8
        addEntry({
          id: 'vike/fetch',
          route: '/**',
        })
      },

      sharedDuringBuild: true,
    },
    ...pluginUniversalDeployServer(vikeConfig),
    catchAll(),
  ]
}

function pluginUniversalDeployServer(vikeConfig: VikeConfigInternal): Plugin[] {
  const serverConfig = vikeConfig._pageConfigGlobal.configValueSources.server?.[0]?.definedAt
  const vikeExtends = vikeConfig.config.extends
    ? Array.isArray(vikeConfig.config.extends)
      ? vikeConfig.config.extends
      : [vikeConfig.config.extends]
    : []
  // TODO if target supporting UD are used, like vite-plugin-vercel@11, we should also install some of those plugins
  if (serverConfig && 'filePathAbsoluteFilesystem' in serverConfig) {
    const serverPath = serverConfig['filePathAbsoluteFilesystem']

    // +server was also used by vike-server and vike-photon
    const vikeExtendsNames = new Set(vikeExtends.map((vikePlugin) => vikePlugin.name))
    if (vikeExtendsNames.has('vike-server') || vikeExtendsNames.has('vike-photon')) return []

    if (serverPath) {
      const filterRolldown = {
        id: {
          include: new RegExp(escapeRegex(serverPath)),
        },
      }

      return [
        {
          name: 'vike:pluginUniversalDeploy:server',
          resolveId: {
            order: 'pre',
            filter: {
              id: catchAllRE,
            },
            handler() {
              // Will resolve the entry from the users project root
              return this.resolve(serverPath)
            },
          },

          sharedDuringBuild: true,
        },
        {
          name: 'vike:pluginUniversalDeploy:serverEntry',
          apply: 'build',

          applyToEnvironment(env) {
            return env.config.consumer === 'server'
          },

          transform: {
            order: 'post',
            filter: filterRolldown,
            handler(code, id) {
              const ms = new MagicString(code)
              // Inject Vike virtual server entry
              ms.prepend(`import "${serverEntryVirtualId}";\n`)

              return {
                code: ms.toString(),
                map: ms.generateMap({
                  hires: true,
                  source: id,
                }),
              }
            },
          },

          sharedDuringBuild: true,
        },
        devServer(),
      ]
    }
  }

  return []
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

function assertIsr(exports: unknown): number | null {
  const isr = extractIsr(exports)
  if (isr === null || isr === undefined) return null

  return (
    isr as {
      expiration: number
    }
  ).expiration
}

function assertEdge(exports: unknown): boolean | null {
  if (exports === null || typeof exports !== 'object') return null
  if (!('edge' in exports)) return null
  const edge = (exports as { edge: unknown }).edge

  assertUsage(typeof edge === 'boolean', ' `{ edge }` must be a boolean')

  return edge
}
