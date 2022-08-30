const PROJECT_VERSION = '0.4.29'

export const projectInfo = {
  projectName: 'vite-plugin-ssr' as const,
  projectVersion: PROJECT_VERSION,
  npmPackageName: 'vite-plugin-ssr' as const,
  githubRepository: 'https://github.com/brillout/vite-plugin-ssr' as const,
  discordInviteToolChannel: 'https://discord.com/invite/qTq92FQzKb' as const
}

// Trick: since `utils/asserts.ts` depends on this file (`utils/projectInfo.ts`), we can have confidence that this file is always instantiated. So that we don't have to initialize this code snippet at every possible entry. (There are a *lot* of entries: `client/router/`, `client/`, `node/`, `node/plugin/`, `node/cli`, etc.)
globalThis.__vite_plugin_ssr__instances = globalThis.__vite_plugin_ssr__instances || []
globalThis.__vite_plugin_ssr__instances.push(projectInfo.projectVersion)
declare global {
  var __vite_plugin_ssr__instances: undefined | string[]
}
