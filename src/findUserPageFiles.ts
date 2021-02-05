export default findUserPageFiles

function findUserPageFiles(): any[] {
  //@ts-ignore
  const pageViews = import.meta.glob('/**/*.page.*') as any
  //@ts-ignore
  const pageConfigs = import.meta.glob('/**/*.config.*') as any
  return { ...pageViews, ...pageConfigs }
}
