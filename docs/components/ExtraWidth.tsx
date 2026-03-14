export { ExtraWidth }

import React from 'react'

function ExtraWidth({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const scrollbarMaxWidth = 30
  return (
    <div
      style={{
        width: `calc(100vw - ${scrollbarMaxWidth}px)`,
        marginLeft: `calc((100% - (100vw - ${scrollbarMaxWidth}px)) / 2)`,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={style}>{children}</div>
    </div>
  )
}
