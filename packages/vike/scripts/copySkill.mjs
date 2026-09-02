// Copy Vike's skill for AI agents into the npm package: skills/vike/SKILL.md => packages/vike/skills/vike/SKILL.md
// - Run upon publishing (`prepack` script), see package.json
// - The repository root file is the single source of truth (it's also what `$ npx skills add vikejs/vike` installs), see https://vike.dev/ai#install
// - The runtime compares the user's installed skill against the copy, see src/node/vite/plugins/pluginDev/logSkillHint.ts
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname_ = path.dirname(fileURLToPath(import.meta.url))
const source = path.join(__dirname_, '../../../skills/vike/SKILL.md')
const target = path.join(__dirname_, '../skills/vike/SKILL.md')

fs.mkdirSync(path.dirname(target), { recursive: true })
fs.copyFileSync(source, target)
console.log(`Copied ${path.relative(process.cwd(), source)} to ${path.relative(process.cwd(), target)}`)
