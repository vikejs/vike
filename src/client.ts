// TODO - check whether `vite/dynamic-import-polyfill` needs to be inserted as very first dependency
import 'vite/dynamic-import-polyfill'
import './user-files/findUserFiles.entry.client'

export { getPage } from './getPage.client'
