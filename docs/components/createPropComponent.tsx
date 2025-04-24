export { PropPageContext }
export { PropGlobalContext }

import React from 'react'

const PropPageContext = createPropComponent('pageContext')
const PropGlobalContext = createPropComponent('globalContext')

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
