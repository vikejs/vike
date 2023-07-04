export { loadEnvFiles }

import { isProduction, dynamicImport } from './utils'
import type { Stats } from 'node:fs'
type Fs = typeof import('fs')

async function loadEnvFiles(): Promise<void> {
  if (isProduction()) {
  } else {
    const vite = await dynamicImport<typeof import('vite')>('vite')
  }
}

async function loadEnvWithNode(): Promise<boolean> {
  let fs: Fs
  try {
    fs = await dynamicImport<Fs>('fs')
  } catch {
    return false
  }

  return true

  function tryStatSync(file: string): Stats | undefined {
    try {
      return fs.statSync(file, { throwIfNoEntry: false })
    } catch {
      // Ignore errors
    }
  }
}
