import { setPageFiles } from '../shared/getPageFiles'
// @ts-ignore
import * as pageFilesExports from 'virtual:vite-plugin-ssr:pageFiles:client:server-routing'
setPageFiles(pageFilesExports)
