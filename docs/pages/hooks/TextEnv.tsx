export { TextEnv }

import React from 'react'

function TextEnv({ children, style }: { children: any; style?: any }) {
  return <span style={{ color: '#888', fontSize: '0.94em', verticalAlign: 'middle', ...style }}>{children}</span>
}
