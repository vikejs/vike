export * from './assert'
export * from './isBrowser'
export * from './getHeadingId'

export function parseTitleMdx(title: string) {
  const parts = title.split('`')
  return parts
    .map((part, idx) => {
      if (idx === parts.length - 1) {
        return escapeHtml(part)
      }
      if (isEven(idx)) {
        return escapeHtml(part) + '<code>'
      } else {
        return escapeHtml(part) + '</code>'
      }
    })
    .join('')
}

function isEven(i: number) {
  return i % 2 === 0
}

function escapeHtml(unsafeString: string): string {
  // Source: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript/6234804#6234804
  const safe = unsafeString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
  return safe
}
