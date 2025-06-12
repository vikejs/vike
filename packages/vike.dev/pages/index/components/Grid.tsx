export { Grid }

import React from 'react'

function Grid({
  children,
  style,
  className,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        padding: '0 20px',
        ...style,
      }}
    >
      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>{children}</div>
    </div>
  )
}
