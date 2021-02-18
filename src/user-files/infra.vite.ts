export { __getAllUserFiles }

// Vite resolves globs with micromatch: https://github.com/micromatch/micromatch
// Pattern `*([a-zA-Z0-9])` is an Extglob: https://github.com/micromatch/micromatch#extglobs

function __getAllUserFiles(): any {
  const allUserFiles: any = {
    //@ts-ignore
    '.page': import.meta.glob('/**/*.page.*([a-zA-Z0-9])'),
    //@ts-ignore
    '.page.client': import.meta.glob('/**/*.client.*([a-zA-Z0-9])')
  }
  //@ts-ignore
  if (import.meta.env.SSR) {
    Object.assign(allUserFiles, {
      //@ts-ignore
      '.page.server': import.meta.glob('/**/*.server.*([a-zA-Z0-9])'),
      //@ts-ignore
      '.page.route': import.meta.glob('/**/*.route.*([a-zA-Z0-9])')
    })
  }
  return allUserFiles
}
