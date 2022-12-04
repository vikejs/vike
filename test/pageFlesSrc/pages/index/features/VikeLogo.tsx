export { VikeLogo }

import React from 'react'
import logo from './vike.png'

function VikeLogo() {
  return (
    <img
      src={logo}
      style={{
        height: '1.4em',
        verticalAlign: 'middle',
        position: 'relative',
        left: 0,
        top: 0,
        paddingRight: 2
      }}
    />
  )
}
