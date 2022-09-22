import { isBaseAssets } from '../utils/isBaseUrl'
export function getBaseUrl(): string {
  const baseUrl = import.meta.env.BASE_URL
  if (isBaseAssets(baseUrl)) {
    return '/'
  }
  return baseUrl
}
