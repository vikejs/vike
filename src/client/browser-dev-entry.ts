import 'vite/dynamic-import-polyfill'
import '../node/findUserFiles.entry-browser'

import { loadUserFile } from '../node/findUserFiles'

loadUserFile('.browser', { defaultFile: true })
