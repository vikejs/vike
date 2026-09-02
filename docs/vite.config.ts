import svgr from 'vite-plugin-svgr'
import type { UserConfig, Plugin } from 'vite'
import vike from 'vike/plugin'
import tailwindcss from '@tailwindcss/vite'
import { teamData } from './pages/team/teamData'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

// TODO/after-PR-merge: move to standalone file
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

// Injects the content of skills/vike/SKILL.md (the single source of truth, see https://vike.dev/ai#install) into
// the code block of pages/ai/+Page.mdx — before the MDX compiler runs, so that it's syntax highlighted like any other code block.
function skillCodeBlockPlugin(): Plugin {
  const skillFilePath = fileURLToPath(new URL('../skills/vike/SKILL.md', import.meta.url))
  const placeholder = 'SKILL_MD_PLACEHOLDER'
  return {
    name: 'docs:skill-code-block',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/pages/ai/+Page.mdx')) return
      this.addWatchFile(skillFilePath)
      if (!code.includes(placeholder)) throw new Error(`${placeholder} not found in ${id}`)
      const skill = fs.readFileSync(skillFilePath, 'utf8').trimEnd()
      return { code: code.replace(placeholder, skill), map: null }
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
    skillCodeBlockPlugin(),
  ],
  // https://github.com/vikejs/vike/blob/08a1ff55c80ddca64ca6d4417fefd45fefeb4ffb/vike/node/plugin/plugins/replaceConstants.ts#L32
  // @ts-expect-error
  _skipVikeReplaceConstants: (id: string) => id.endsWith('.mdx'),
} satisfies UserConfig
