export { TextGray }

import React from 'react'

function TextGray({ children }: { children: any }) {
  return <span style={{ color: '#888' }}>{children}</span>
}
