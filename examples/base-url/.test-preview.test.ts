import { testRun } from './.testRun'
const base = '/some/base-url'
testRun('npm run preview', { baseServer: base, baseAssets: base })
