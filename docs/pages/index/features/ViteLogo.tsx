export { ViteLogo }

import React from 'react'
import viteLogo from './vite.svg'

function ViteLogo() {
  return (
    <img
      src={viteLogo}
      style={{
        height: '1.4em',
        verticalAlign: 'middle',
        position: 'relative',
        left: -1,
        top: -2,
      }}
    />
  )
}
