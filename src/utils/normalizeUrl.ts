export function normalizeUrl(urlPathname: string): string {
  return '/' + urlPathname.split('/').filter(Boolean).join('/').toLowerCase()
}