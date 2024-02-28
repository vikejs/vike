export { projectInfo }
export { PROJECT_VERSION }

import { onProjectInfo } from './assertSingleInstance.js'

const PROJECT_VERSION = '0.4.164' as const

const projectInfo = {
  projectName: 'Vike' as const,
  projectVersion: PROJECT_VERSION
}

// Trick: since `utils/asserts.ts` depends on this file (`utils/projectInfo.ts`), we can have confidence that this file is always instantiated. So that we don't have to initialize this code snippet at every possible entry. (There are a *lot* of entries: `client/router/`, `client/`, `node/`, `node/plugin/`, `node/cli`, etc.)
onProjectInfo(projectInfo.projectVersion)
