import { testRun } from '../../examples/base-url-v1/.testRun'

testRun('npm run start', { baseServer: '/some/base-url/', baseAssets: 'http://localhost:8080/cdn/' })
