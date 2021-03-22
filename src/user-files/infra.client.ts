import { setAllUserFilesGetter } from './infra.shared'

setAllUserFilesGetter(__getAllUserFiles)

function __getAllUserFiles(): any {
  // Vite resolves globs with micromatch: https://github.com/micromatch/micromatch
  // Pattern `*([a-zA-Z0-9])` is an Extglob: https://github.com/micromatch/micromatch#extglobs
  const allUserFiles: any = {
    //@ts-ignore
    '.page': import.meta.glob('/**/*.page.*([a-zA-Z0-9])'),
    //@ts-ignore
    '.page.client': import.meta.glob('/**/*.page.client.*([a-zA-Z0-9])'),
    //@ts-ignore
    '.page.route': import.meta.glob('/**/*.page.route.*([a-zA-Z0-9])')
  }
  return allUserFiles
}
