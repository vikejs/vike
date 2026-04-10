import { testRun } from '../../examples/base-url/.testRun'

testRun('pnpm run start', { baseServer: '/some/base-url/', baseAssets: 'http://localhost:8080/cdn/' })
