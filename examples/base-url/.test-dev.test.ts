import { testRun } from './.testRun'
const base = '/some/base-url'
testRun('npm run dev', { baseServer: base, baseAssets: base })
