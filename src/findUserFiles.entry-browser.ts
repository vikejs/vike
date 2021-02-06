import { fileFinder } from './findUserFiles.vite'
import { setFileFinder } from './findUserFiles'

setFileFinder(async () => {
  const filesByType = fileFinder()
  return filesByType
})
