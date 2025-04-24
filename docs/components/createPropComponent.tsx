export { PropPageContext }

import React from 'react'

const PropPageContext = createPropComponent('pageContext')

function createPropComponent(obj: 'pageContext' | 'globalContext') {
  return function Prop({ children, prop }: { children: React.ReactNode; prop: string }) {
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
}
