export { getAllUserFiles }
export { setAllUserFilesGetter }
export { FileType }

type FileType = '.page' | '.server' | '.route' | '.browser'

type AllUserFiles = Record<FileType, Record<FilePath, LoadFile>>
type FilePath = string
type LoadFile = () => Promise<any>

let getAllUserFiles: () => Promise<AllUserFiles>
function setAllUserFilesGetter(_getAllUserFiles: any) {
  getAllUserFiles = _getAllUserFiles
}
