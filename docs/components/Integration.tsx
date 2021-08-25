import React from 'react'
import { assert } from 'libframe-docs/utils'
export { Integration }

function Integration({ toolTypeName }: { toolTypeName: string }) {
  assert(toolTypeName)
  return (
    <>
      <p>
        In principle, we should be able to use <code>vite-plugin-ssr</code> with any {toolTypeName}. However, if you are
        having difficulties integrating {toolTypeName.startsWith('a') ? 'an' : 'a'} {toolTypeName}, feel free to{' '}
        <a href="https://discord.com/invite/qTq92FQzKb">join and ask our Discord</a> or{' '}
        <a href="https://github.com/brillout/vite-plugin-ssr/issues/new">open a GitHub ticket</a>.
      </p>
    </>
  )
}
