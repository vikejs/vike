export { VikeLogo }

import React from 'react'
import vikeIcon from '../../../images/icons/vike-square-gradient.svg'

function VikeLogo() {
  return (
    <img
      src={vikeIcon}
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
