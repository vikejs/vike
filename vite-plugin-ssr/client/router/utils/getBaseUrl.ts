export { getBaseUrl }

function getBaseUrl() {
  const baseUrl = import.meta.env.BASE_URL
  if (isBaseAssets(baseUrl)) {
    return '/'
  }
  return baseUrl
}

function isBaseAssets(base: string) {
  if (base.startsWith('http')) {
    return true
  }
  return false
}
