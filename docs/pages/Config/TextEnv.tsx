export { TextEnv }

import React from 'react'

function TextEnv({ children }: { children: any }) {
  return <span style={{ color: '#888' }}>{children}</span>
}
