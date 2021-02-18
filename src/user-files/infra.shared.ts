export { getAllUserFiles }
export { setAllUserFilesGetter }
export { FileType }

type FileType = '.page' | '.page.server' | '.page.route' | '.page.client'

type AllUserFiles = Record<FileType, Record<FilePath, LoadFile>>
type FilePath = string
type LoadFile = () => Promise<any>

let getAllUserFiles: () => Promise<AllUserFiles>
function setAllUserFilesGetter(_getAllUserFiles: any) {
  getAllUserFiles = _getAllUserFiles
}
