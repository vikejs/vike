export { PropPageContext }
export { PropGlobalContext }

import React from 'react'

const PropPageContext = createPropComponent('pageContext')
const PropGlobalContext = createPropComponent('globalContext')

function createPropComponent(obj: 'pageContext' | 'globalContext') {
  return function Prop({ id }: { id: string }) {
    return (
      <h3 id={id}>
        <code>
          {obj}.{id}
        </code>
      </h3>
    )
  }
}
