import { __getAllUserFiles } from './infra.vite'
import { setAllUserFilesGetter } from './infra.shared'
setAllUserFilesGetter(__getAllUserFiles)
