const getter = '__vite_plugin_ssr__user_files_getter'
const globalObject = getGlobalObject()

export { getAllUserFiles }
export { setUserFilesGetter }
export { setGetterLoader }
export { getterAlreadySet }

export { FileType }

type FileType = '.page' | '.page.server' | '.page.route' | '.page.client'

type AllUserFiles = Record<FileType, Record<FilePath, LoadFile>>
type FilePath = string
type LoadFile = () => Promise<any>

async function getAllUserFiles(): Promise<AllUserFiles> {
  if (loadGetter) {
    await loadGetter()
  }
  return globalObject[getter]!()
}

function setUserFilesGetter(_getter: any) {
  globalObject[getter] = _getter
}

function getterAlreadySet(): boolean {
  return getter in globalObject
}

let loadGetter: undefined | (() => Promise<void>)
function setGetterLoader(_getterLoader: () => Promise<void>) {
  loadGetter = _getterLoader
}

function getGlobalObject() {
  let globalObject
  if (typeof window !== 'undefined') {
    globalObject = window
  } else {
    globalObject = global
  }
  return globalObject as { [getter]?: () => Promise<AllUserFiles> }
}
