export { isStorybook }

import { isToolCli } from './isToolCli.js'

function isStorybook(): boolean {
  const TEST_CLI = isToolCli('storybook')
  // https://github.com/storybookjs/storybook/pull/33938
  const TEST_ENV = 'STORYBOOK' in process.env
  return TEST_ENV || TEST_CLI
}
