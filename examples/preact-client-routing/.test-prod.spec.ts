import { isWindows } from '../../libframe/test/setup'
import { testPages } from '../../boilerplates/.testPages'
testPages('npm run prod', 'react', { skipTitleColorTest: isWindows() })
