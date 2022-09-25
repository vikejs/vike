import { isWindows } from '@brillout/test-e2e'
import { testRun } from '../../boilerplates/.testRun'
testRun('npm run preview', { skipCssTest: isWindows(), uiFramewok: 'preact' })
