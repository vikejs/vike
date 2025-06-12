export function removeFileExtention(filePath: string) {
  return filePath.split('.').slice(0, -1).join('.')
}
