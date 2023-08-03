import { testRun } from '../base-url-v1/.testRun'
const base = '/some/base-url'
testRun('npm run dev', { baseServer: base, baseAssets: base })
