// https://github.com/cloudflare/workers-sdk/issues/1481#issuecomment-2550929035
export function isCloudflareWorkers() {
  return typeof navigator !== 'undefined' && navigator?.userAgent === 'Cloudflare-Workers'
}
