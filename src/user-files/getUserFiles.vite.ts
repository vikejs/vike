export { fileFinder }

// Vite resolves globs with micromatch: https://github.com/micromatch/micromatch
// Pattern `*([a-zA-Z0-9])` is an Extglob: https://github.com/micromatch/micromatch#extglobs

function fileFinder(): any {
  const filesByType: any = {
    //@ts-ignore
    '.page': import.meta.glob('/**/*.page.*([a-zA-Z0-9])'),
    //@ts-ignore
    '.browser': import.meta.glob('/**/*.page.browser.*([a-zA-Z0-9])')
  }
  //@ts-ignore
  if (import.meta.env.SSR) {
    Object.assign(filesByType, {
      //@ts-ignore
      '.server': import.meta.glob('/**/*.page.server.*([a-zA-Z0-9])'),
      //@ts-ignore
      '.route': import.meta.glob('/**/*.page.route.*([a-zA-Z0-9])')
    })
  }
  return filesByType
}
