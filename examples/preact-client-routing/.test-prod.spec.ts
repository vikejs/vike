import { isWindows } from '../../libframe/test/setup'
import { testRun } from '../../boilerplates/.testRun'
testRun('npm run prod', { skipTitleColorTest: isWindows() })
