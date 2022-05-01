import { testRun } from '../../boilerplates/.testRun'
testRun('pnpm run prod', { cwd: `${__dirname}/app`, noDefaultPageInUserCode: true })
