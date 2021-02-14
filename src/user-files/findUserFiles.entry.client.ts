import { fileFinder } from './findUserFiles.vite'
import { setFileFinder, UserFiles } from './findUserFiles.shared'

setFileFinder(async () => {
  const userFiles = fileFinder() as UserFiles
  return userFiles
})
