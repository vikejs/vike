import { testRun } from '../../examples/base-url/.testRun'

testRun('pnpm run start', { baseAssets: 'http://localhost:8080/cdn/', baseServer: '/' })
