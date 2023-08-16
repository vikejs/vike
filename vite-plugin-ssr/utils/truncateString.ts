export function truncateString(str: string, lenMax: number, gray: null | ((ellipsis: string) => string)) {
  if (str.length < lenMax) {
    return str
  } else {
    // May break ANSI codes
    //  - So far, the str we pass to truncateString(str) are expected to not contain any ANSI code
    str = str.substring(0, lenMax - 3)

    let ellipsis = '...'
    if (gray) ellipsis = gray(ellipsis)
    str = str + ellipsis

    return str
  }
}
