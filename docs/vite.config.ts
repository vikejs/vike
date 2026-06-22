import svgr from 'vite-plugin-svgr'
import type { UserConfig, Plugin } from 'vite'
import vike from 'vike/plugin'
import tailwindcss from '@tailwindcss/vite'
import { teamData } from './pages/team/teamData'

// Serves the team list as /team.json — same data that powers
// pages/team/+Page.mdx via pages/team/maintainersList.tsx.
function teamJsonPlugin(): Plugin {
  const body = JSON.stringify(teamData, null, 2) + '\n'
  return {
    name: 'team-json',
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

export default {
  optimizeDeps: { include: ['@batijs/elements'] },
  plugins: [
    // Used by the landing page, see `.svg?react` imports
    svgr(),
    vike(),
    tailwindcss(),
    teamJsonPlugin(),
  ],
  // https://github.com/vikejs/vike/blob/08a1ff55c80ddca64ca6d4417fefd45fefeb4ffb/vike/node/plugin/plugins/replaceConstants.ts#L32
  // @ts-expect-error
  _skipVikeReplaceConstants: (id: string) => id.endsWith('.mdx'),
} satisfies UserConfig
