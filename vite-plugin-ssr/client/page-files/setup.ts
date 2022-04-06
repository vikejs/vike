import { setPageFilesClientSide } from '../../shared/getPageFiles'
// @ts-ignore
import * as pageFilesExports from 'virtual:vite-plugin-ssr:pageFiles:client'
setPageFilesClientSide(pageFilesExports)
