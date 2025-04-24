export { ContextProp }

import React from 'react'

function ContextProp({
  children,
  prop,
  obj
}: { children: React.ReactNode; prop: string; obj: 'pageContext' | 'globalContext' }) {
  return (
    <li>
      <b>
        <code>
          {obj}.{prop}
        </code>
      </b>
      : {children}
    </li>
  )
}
