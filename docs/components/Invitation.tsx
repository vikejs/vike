export { Invitation }

import React from 'react'
import { projectInfo } from '../utils/projectInfo'

function Invitation() {
  return (
    <>
      <a href={projectInfo.discordInvite}>join our Discord server</a> or{' '}
      <a href={projectInfo.githubIssues}>open a new GitHub issue</a>
    </>
  )
}
