export { PhotonBetaWarning }

import React from 'react'

function PhotonBetaWarning() {
  return (
    <blockquote>
      <p>
        <b>Photon is currently in beta</b> — you can use it in production, but expect breaking changes more frequently
        than usual.
      </p>
    </blockquote>
  )
}
