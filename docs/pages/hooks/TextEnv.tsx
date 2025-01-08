export { TextEnv }
export { TextEnv2 }

import React from 'react'

function TextEnv({ children, style }: { children: any; style?: any }) {
  return <span style={{ color: '#888', fontSize: '0.94em', verticalAlign: 'middle', ...style }}>{children}</span>
}
function TextEnv2({ children }: { children: any }) {
  return <TextEnv style={{ fontWeight: 600 }}>{children}</TextEnv>
}
