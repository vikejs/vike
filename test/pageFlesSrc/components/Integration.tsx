export { Integration }

import React from 'react'
import { assert } from '@brillout/docpress'
import { Invitation } from './Invitation'

function Integration({ toolTypeName }: { toolTypeName: string }) {
  assert(toolTypeName)
  return (
    <>
      <p>
        In principle, you can use <code>vite-plugin-ssr</code> with any {toolTypeName}. However, if you are having
        difficulties integrating {toolTypeName.startsWith('a') ? 'an' : 'a'} {toolTypeName}, <Invitation />.
      </p>
    </>
  )
}
