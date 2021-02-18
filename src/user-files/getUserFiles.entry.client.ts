import { fileFinder } from './getUserFiles.vite'
import { setFileFinder } from './getUserFiles.shared'

setFileFinder(async () => {
  const userFiles = fileFinder()
  return userFiles
})
