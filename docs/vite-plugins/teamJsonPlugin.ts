export { teamJsonPlugin }

import { teamData } from '../pages/team/teamData'
import type { Plugin } from 'vite'

// Serves the team list as /team.json — same data that powers
// pages/team/+Page.mdx via pages/team/maintainersList.tsx.
function teamJsonPlugin(): Plugin {
  const body = JSON.stringify(teamData, null, 2) + '\n'
  return {
    name: 'vike-docs:team-json',
    configureServer(server) {
      server.middlewares.use('/team.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(body)
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'team.json', source: body })
    },
  }
}
