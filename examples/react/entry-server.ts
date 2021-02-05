import { getPage as _getPage } from 'vite-plugin-ssr'

export { getPage }

function getPage(url: string) {
  const pageViews = import.meta.glob('/**/*.page.*') as any
  const pageConfigs = import.meta.glob('/**/*.config.*') as any
  console.log(pageViews)
  console.log(pageConfigs)

  return _getPage(url)
  //return _getPage(url, pageViews, pageConfigs);
}
