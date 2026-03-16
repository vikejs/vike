import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { assertWarning } from '../../../../utils/assert.js'
import pc from '@brillout/picocolors'

export function hasVikeServerOrVikePhoton(vikeConfig: VikeConfigInternal) {
  const vikeExtendsNames = new Set(
    vikeConfig._extensions.map(
      (plusFile) => ('fileExportsByConfigName' in plusFile ? plusFile.fileExportsByConfigName : {}).name,
    ),
  )
  const vikeServerOrVikePhoton = vikeExtendsNames.has('vike-server')
    ? 'vike-server'
    : vikeExtendsNames.has('vike-photon')
      ? 'vike-photon'
      : null
  if (vikeServerOrVikePhoton) {
    assertWarning(
      false,
      `${pc.cyan(vikeServerOrVikePhoton)} is deprecated, see ${pc.underline('https://vike.dev/migration/universal-deploy')}`,
      { onlyOnce: true },
    )
    return true
  }
}
