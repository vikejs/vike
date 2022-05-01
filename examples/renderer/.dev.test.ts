import { testRun } from '../../boilerplates/.testRun'
testRun('pnpm run dev', { cwd: `${__dirname}/app`, noDefaultPageInUserCode: true })
