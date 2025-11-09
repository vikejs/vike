import { testRun } from './.testRun'

process.env.NODE_ENV = 'production'
testRun('pnpm run preview')
