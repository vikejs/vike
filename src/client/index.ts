// TODO - check whether `vite/dynamic-import-polyfill` needs to be inserted as very first dependency
import 'vite/dynamic-import-polyfill'
import '../node/findUserFiles.entry-browser'

export { getPage } from './getPage'
