export { Integration }

import React from 'react'
import { assert } from '@brillout/docpress'
import { projectInfo } from '../utils'

function Integration({ toolTypeName }: { toolTypeName: string }) {
  assert(toolTypeName)
  return (
    <>
      <p>
        In principle, we can use <code>vite-plugin-ssr</code> with any {toolTypeName}. If you're having difficulties
        integrating {toolTypeName.startsWith('a') ? 'an' : 'a'} {toolTypeName}, <a href={projectInfo.githubDiscussions}>create a new discussion on GitHub</a>.
      </p>
    </>
  )
}
