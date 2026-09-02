export { skillCodeBlockPlugin }

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

// Injects the content of skills/vike/SKILL.md (the single source of truth, see https://vike.dev/ai#install) into
// the code block of pages/ai/+Page.mdx — before the MDX compiler runs, so that it's syntax highlighted like any other code block.
function skillCodeBlockPlugin(): Plugin {
  const skillFilePath = fileURLToPath(new URL('../../skills/vike/SKILL.md', import.meta.url))
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
