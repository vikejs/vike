import { testRun } from '../base-url-v1/.testRun'

testRun('npm run start', { baseAssets: 'http://localhost:8080/cdn/', baseServer: '/' })
