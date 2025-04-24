export { PropPageContext }

import React from 'react'

const PropPageContext = createPropComponent('pageContext')

function createPropComponent(obj: 'pageContext' | 'globalContext') {
  return function Prop({ name }: { name: string }) {
    return (
      <h3 id={name}>
        <code>
          {obj}.{name}
        </code>
      </h3>
    )
  }
}
