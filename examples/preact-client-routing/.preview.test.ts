import { isWindows } from '../../libframe/test/setup'
import { testRun } from '../../boilerplates/.testRun'
testRun('npm run preview', { skipCssTest: isWindows(), uiFramewok: 'preact' })
