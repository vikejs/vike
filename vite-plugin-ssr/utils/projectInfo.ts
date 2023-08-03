export { projectInfo }
export type { ProjectTag }

import { onProjectInfo } from './assertSingleInstance'

const PROJECT_VERSION = '0.4.134' as const

type PackageName = typeof projectInfo.npmPackageName
type ProjectVersion = typeof projectInfo.projectVersion
type ProjectTag = `[${PackageName}]` | `[${PackageName}@${ProjectVersion}]`

const projectInfo = {
  projectName: 'vite-plugin-ssr' as const,
  projectVersion: PROJECT_VERSION,
  npmPackageName: 'vite-plugin-ssr' as const,
  githubRepository: 'https://github.com/brillout/vite-plugin-ssr' as const
}

// Trick: since `utils/asserts.ts` depends on this file (`utils/projectInfo.ts`), we can have confidence that this file is always instantiated. So that we don't have to initialize this code snippet at every possible entry. (There are a *lot* of entries: `client/router/`, `client/`, `node/`, `node/plugin/`, `node/cli`, etc.)
onProjectInfo(projectInfo.projectVersion)
