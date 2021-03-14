// Workaround for https://github.com/vitejs/vite/issues/2390

import { renameSync, symlinkSync, mkdirSync } from 'fs'
import {
  join as pathJoin,
  relative as pathRelative,
  resolve as pathResolve,
  dirname as pathDirname
} from 'path'
import { assert } from './utils'

export { workaroundViteIssue2390 }

function workaroundViteIssue2390(userProjectRoot: string): void {
  if (!__dirname.includes('node_modules')) return

  assert(__dirname.endsWith('node_modules/vite-plugin-ssr/dist'))
  const vitePluginSsrRoot = pathResolve(`${__dirname}/..`)

  const distDir = pathJoin(userProjectRoot, 'dist')
  try {
    mkdirSync(distDir)
  } catch (_) {}

  const oldPath = vitePluginSsrRoot
  const newPath = pathJoin(distDir, 'vite-plugin-ssr')

  console.log(oldPath, newPath)
  // Replace `oldPath` with a symlink to `newPath`
  renameSync(oldPath, newPath)
  symlinkSync(pathRelative(pathDirname(oldPath), newPath), oldPath)
}
