export { fileFinder }

function fileFinder() {
  //@ts-ignore
  if (import.meta.env.SSR) {
    return {
      //@ts-ignore
      '.page': import.meta.glob('/**/*.page.*'),
      //@ts-ignore
      '.server': import.meta.glob('/**/*.server.*'),
      //@ts-ignore
      '.html': import.meta.glob('/**/*.html.*')
    }
  } else {
    return {
      //@ts-ignore
      '.page': import.meta.glob('/**/*.page.*')
    }
  }
}
