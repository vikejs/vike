import { testRun } from '../../examples/base-url/.testRun'
const base = '/some/base-url'
testRun('npm run preview', { baseServer: base, baseAssets: base })
