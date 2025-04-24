export { createPropComponent }

import React from 'react'

function createPropComponent({
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
