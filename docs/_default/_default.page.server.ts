export * from 'libframe-docs/_default.page.server'
import logoUrl from '../icons/vite-plugin-ssr.svg'
import { setFrame } from 'libframe-docs/_default.page.server'
import { headings } from '../headings'
import { projectInfo } from '../utils'

setFrame({
  projectVersion: projectInfo.version,
  projectName: projectInfo.name,
  projectNameIsCodeSnippet: true,
  repo: projectInfo.githubRepository,
  headings,
  logoUrl
})
