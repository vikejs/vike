import { setPageFiles } from '../../shared/getPageFiles.js'
// @ts-ignore
import * as pageFilesExports from 'virtual:vite-plugin-ssr:importUserCode:client:server-routing'
setPageFiles(pageFilesExports)
