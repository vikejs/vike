export { getBaseUrl }

function getBaseUrl(): string {
  // @ts-ignore
  const baseUrl = import.meta.env.BASE_URL as string
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
