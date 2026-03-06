export { pluginLicenseKey }

import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { applyDev } from '../../../utils/isDev.js'
import { getVikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { validateLicenseKey, getRootDomain } from '../../licenseKey/validateLicenseKey.js'
import pc from '@brillout/picocolors'
import '../assertEnvVite.js'

function pluginLicenseKey(): Plugin[] {
  return [
    {
      name: 'vike:pluginLicenseKey',
      apply: applyDev,
      configResolved: {
        async handler() {
          const vikeConfig = await getVikeConfigInternal()
          const keyFromConfig = vikeConfig.config.vikeKey as string | undefined
          const keyFromEnv = process.env.VIKE_KEY
          const licenseKey = keyFromConfig ?? keyFromEnv

          if (!licenseKey) return

          const result = validateLicenseKey(licenseKey)
          if (!result.valid) {
            const source = keyFromConfig ? '+config.js (vikeKey)' : 'VIKE_KEY environment variable'
            console.warn(
              pc.yellow(
                `[vike] Invalid license key provided via ${source}: ${result.reason}. Get your license key at https://vike.dev/pricing`,
              ),
            )
            return
          }

          // Check if current root domain is covered by the license
          const projectDomain = getProjectDomain()
          if (projectDomain && !result.domains.some((d) => getRootDomain(d) === getRootDomain(projectDomain))) {
            console.warn(
              pc.yellow(
                `[vike] License key does not cover domain "${projectDomain}". Licensed domains: ${result.domains.join(', ')}. Get your license key at https://vike.dev/pricing`,
              ),
            )
          }
        },
      },
    },
  ]
}

function getProjectDomain(): string | null {
  try {
    const pkg = JSON.parse(readFileSync(`${process.cwd()}/package.json`, 'utf8')) as Record<string, unknown>
    const homepage = pkg.homepage
    if (typeof homepage === 'string' && homepage) {
      try {
        return new URL(homepage).hostname
      } catch {
        return null
      }
    }
  } catch {
    // no package.json or no homepage field
  }
  return null
}
