import { fileFinder } from './findUserFiles.vite'
import { setFileFinder, UserFiles } from './findUserFiles'

setFileFinder(async () => {
  const userFiles = fileFinder() as UserFiles
  return userFiles
})
