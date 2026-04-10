import { testRun } from './.testRun'
const base = '/some/base-url'
testRun('pnpm run preview', { baseServer: base, baseAssets: base })
