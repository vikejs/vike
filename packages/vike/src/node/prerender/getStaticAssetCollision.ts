export { getStaticAssetCollision }
export { getPublicDirCopied }

import fs from 'node:fs'
import path from 'node:path'
import type { ResolvedConfig } from 'vite'
import type { ViteManifest } from '../../types/ViteManifest.js'

// Whether a pre-rendered `pageContext.content` file (e.g. `favicon.ico`) would overwrite a static asset: a `public/` file or a file written by the client build.
// https://vike.dev/pageContext#content
function getStaticAssetCollision(
  filePathRelative: string,
  publicDir: string | null,
  clientBuildFiles: null | Set<string>,
  assetsManifest: ViteManifest,
): null | string {
  if (publicDir) {
    const filePathPublic = path.join(publicDir, filePathRelative)
    if (fs.statSync(filePathPublic, { throwIfNoEntry: false })?.isFile()) return filePathPublic
  }
  if (clientBuildFiles?.has(filePathRelative)) return `the client build's ${filePathRelative}`
  // Also contains the assets of the server build that Vike moves to the client outDir
  for (const entry of Object.values(assetsManifest)) {
    const files = [entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])]
    if (files.some((file) => file.replace(/^\//, '') === filePathRelative)) return `the client build's ${entry.file}`
  }
  return null
}

// The `public/` directory, if the client build copies it to the client outDir
function getPublicDirCopied(viteConfig: Pick<ResolvedConfig, 'publicDir' | 'build' | 'environments'>): null | string {
  // Vike sets `copyPublicDir` for the client environment, which takes precedence over the top-level `build.copyPublicDir`
  const { copyPublicDir } = viteConfig.environments?.client?.build ?? viteConfig.build
  return (copyPublicDir !== false && viteConfig.publicDir) || null
}
