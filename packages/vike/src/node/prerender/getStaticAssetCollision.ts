export { getStaticAssetCollision }

import fs from 'node:fs'
import path from 'node:path'
import type { ViteManifest } from '../../types/ViteManifest.js'

// Whether a pre-rendered `pageContext.content` file (e.g. `favicon.ico`) would overwrite a static asset: a `public/` file or a file emitted by the client build.
// https://vike.dev/pageContext#content
function getStaticAssetCollision(
  filePathRelative: string,
  publicDir: string | null,
  assetsManifest: ViteManifest,
): null | string {
  if (publicDir) {
    const filePathPublic = path.join(publicDir, filePathRelative)
    if (fs.statSync(filePathPublic, { throwIfNoEntry: false })?.isFile()) return filePathPublic
  }
  for (const entry of Object.values(assetsManifest)) {
    const files = [entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])]
    if (files.some((file) => file.replace(/^\//, '') === filePathRelative)) return `the client build's ${entry.file}`
  }
  return null
}
