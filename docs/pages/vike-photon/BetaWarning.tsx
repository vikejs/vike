import React from 'react'
import { Warning } from '@brillout/docpress'

interface BetaWarningProps {
  message?: string
}

export function VikePhotonBetaWarning({
  message = 'Photon is currently in beta. APIs may change before stable release.',
}: BetaWarningProps) {
  return <Warning>{message}</Warning>
}
