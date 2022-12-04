export { ViteLogo }

import React from 'react'
import logo from './vite.svg'

function ViteLogo() {
  return (
    <img
      src={logo}
      style={{
        height: '1.4em',
        verticalAlign: 'middle',
        position: 'relative',
        left: -1,
        top: -2
      }}
    />
  )
}
