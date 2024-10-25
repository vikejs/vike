export { TopNavigation }

import React from 'react'
import iconSeedling from '../images/icons/seedling.svg'

function TopNavigation() {
  return (
    <a
      className="colorize-on-hover"
      href="/new"
      style={{
        color: 'inherit',
        height: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: '0 var(--padding-side)',
      }}
    >
      <img className="decolorize-7" src={iconSeedling} style={{ height: 23, marginRight: 10 }} /> Get Started
    </a>
  )
}
