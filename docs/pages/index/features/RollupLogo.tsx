export { RollupLogo }

import React from 'react'
import logo from './rollup.svg'

function RollupLogo() {
  return (
    <img
      src={logo}
      style={{
        height: '1.2em',
        verticalAlign: 'middle',
        marginRight: 4,
        marginLeft: 1,
        position: 'relative',
        top: -1
      }}
    />
  )
}
