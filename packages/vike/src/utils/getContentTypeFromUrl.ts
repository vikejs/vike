export { getContentTypeFromUrl }

import { parseUrl } from './parseUrl.js'

const contentTypes = new Map(
  Object.entries({
    atom: 'application/atom+xml;charset=utf-8',
    rss: 'application/rss+xml;charset=utf-8',
    xml: 'application/xml;charset=utf-8',
    json: 'application/json',
    jsonld: 'application/ld+json',
    webmanifest: 'application/manifest+json',
    txt: 'text/plain;charset=utf-8',
    md: 'text/markdown;charset=utf-8',
    csv: 'text/csv;charset=utf-8',
    ics: 'text/calendar;charset=utf-8',
    html: 'text/html;charset=utf-8',
    htm: 'text/html;charset=utf-8',
    css: 'text/css;charset=utf-8',
    js: 'text/javascript;charset=utf-8',
    mjs: 'text/javascript;charset=utf-8',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    ico: 'image/x-icon',
    pdf: 'application/pdf',
  }),
)

// Content-Type of the URL's file extension, or `null` if unknown, see https://vike.dev/pageContext#content
function getContentTypeFromUrl(url: string): string | null {
  const { pathname } = parseUrl(url, '/')
  // Last non-empty segment, see https://vike.dev/url-normalization
  const fileName = pathname.split('/').filter(Boolean).pop() ?? ''
  const i = fileName.lastIndexOf('.')
  const fileExtension = i > 0 ? fileName.slice(i + 1).toLowerCase() : null
  return (fileExtension && contentTypes.get(fileExtension)) || null
}
