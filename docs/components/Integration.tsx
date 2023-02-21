export { Integration }

import React from 'react'
import { assert } from '@brillout/docpress'
import { projectInfo } from '../utils'

function Integration({ toolTypeName }: { toolTypeName: string }) {
  assert(toolTypeName)
  return (
    <>
      <p>
        In principle, we can use <code>vite-plugin-ssr</code> with any {toolTypeName}.{' '}
        <a href={projectInfo.githubDiscussions}>Create a new discussion on GitHub</a> if you have questions or if you
        want help with integrating {toolTypeName.startsWith('a') ? 'an' : 'a'} {toolTypeName},
      </p>
    </>
  )
}
