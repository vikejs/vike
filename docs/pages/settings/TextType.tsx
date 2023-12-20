export { TextType }

import React from 'react'

function TextType({ children }: { children: string }) {
  return (
    <span style={{ opacity: 0.85, fontSize: '0.9em', verticalAlign: 'middle' }}>
      <code>{children}</code>
    </span>
  )
}
