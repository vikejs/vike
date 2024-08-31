export function removeFileExtension(filePath: string) {
  return filePath.split('.').slice(0, -1).join('.')
}
