export { Timestamp }

import React from 'react'

function Timestamp({ children }: { children: `${number}.${number}` }) {
  return (
    <span
      style={{
        background: 'white',
        fontSize: '1.13em',
        fontWeight: 'bold',
        verticalAlign: 'middle',
        fontFamily: 'monospace',
        marginRight: 2
      }}
    >
      {children}
    </span>
  )
}
