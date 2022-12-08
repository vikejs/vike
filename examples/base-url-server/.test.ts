import { testRun } from '../base-url/.testRun'

testRun('npm run start', { base: '/some/base-url/', baseAssets: 'http://localhost:8080/cdn/' })
