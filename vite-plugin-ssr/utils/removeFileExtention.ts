export function removeFileExtention(filePath: string, filenameContainsHash?: true) {
  return filePath
    .split('.')
    .slice(0, filenameContainsHash ? -2 : -1)
    .join('.')
}
