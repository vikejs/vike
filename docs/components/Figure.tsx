export { Figure }

import React from 'react'

function Figure({
  width,
  text,
  children,
}: { width: number; text: string | React.JSX.Element; children: React.ReactNode }) {
  return (
    <>
      <div
        style={{
          width,
          margin: 'auto',
        }}
      >
        {children}
      </div>
      <div
        style={{
          width: width * 1.5,
          margin: 'auto',
          textAlign: 'center',
          marginTop: 5,
        }}
      >
        <span style={{ color: '#888', fontSize: '0.87em' }}>{text}</span>
      </div>
    </>
  )
}
