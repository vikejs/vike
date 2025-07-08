export { TextBox }

import React from 'react'

const TextBox = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={className}
      style={{
        padding: '0 20px',
        width: '100%',
      }}
    >
      {children}
    </div>
  )
}
