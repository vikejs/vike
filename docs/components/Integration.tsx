import React from 'react'
import { assert } from 'libframe-docs/utils'
import { projectInfo } from '../utils/projectInfo'
export { Integration }

function Integration({ toolTypeName }: { toolTypeName: string }) {
  assert(toolTypeName)
  return (
    <>
      <p>
        In principle, we can use <code>vite-plugin-ssr</code> with any {toolTypeName}. However, if you are having
        difficulties integrating {toolTypeName.startsWith('a') ? 'an' : 'a'} {toolTypeName}, feel free to{' '}
        <a href={projectInfo.discordInvite}>join and ask our Discord</a> or{' '}
        <a href={projectInfo.githubIssues}>open a GitHub ticket</a>.
      </p>
    </>
  )
}
