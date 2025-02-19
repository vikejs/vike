export { BatiNote }

import React from 'react'
import batiLogo from './bati-logo.svg'
const batiLogoSize = 16

function BatiNote() {
  return (
    <p
      style={{
        color: '#888',
        fontSize: '14px',
        textAlign: 'center'
      }}
    >
      Powered by{' '}
      <a href="https://github.com/vikejs/bati">
        Bati{' '}
        <img
          src={batiLogo}
          style={{
            width: batiLogoSize,
            height: batiLogoSize,
            display: 'inline-block',
            verticalAlign: 'text-top'
          }}
        />
      </a>
    </p>
  )
}
