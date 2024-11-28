import React from 'react'

export const TextBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        padding: '0 20px'
      }}
    >
      {children}
    </div>
  )
}
