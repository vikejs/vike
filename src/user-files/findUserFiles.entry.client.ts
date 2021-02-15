import { fileFinder } from './findUserFiles.vite'
import { setFileFinder } from './findUserFiles.shared'

setFileFinder(async () => {
  const userFiles = fileFinder()
  return userFiles
})
