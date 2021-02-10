import { loadUserFile } from '../node/findUserFiles'

export { hydratePage }

function hydratePage() {
  loadUserFile('.browser', { defaultFile: true })
}
