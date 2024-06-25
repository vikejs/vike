export { IntegrationHelp }

import React from 'react'
import { assert } from '@brillout/docpress'
import { projectInfo } from '../utils'

function IntegrationHelp({ toolTypeName }: { toolTypeName: string }) {
  assert(toolTypeName)
  return (
    <>
      <p>
        In principle, you can use Vike with any {toolTypeName}.{' '}
        <a href={projectInfo.githubDiscussions}>Create a new discussion on GitHub</a> if you have questions or if you
        want help with integrating {toolTypeName.startsWith('a') ? 'an' : 'a'} {toolTypeName}.
      </p>
    </>
  )
}
