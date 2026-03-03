import { skip } from '@brillout/test-e2e'
import { testRun } from './.testRun'

// TODO/soon: re-enable test
// Temporarily skipped on Windows, see https://github.com/vikejs/vike/pull/3106#issuecomment-3991210441
if (process.platform === 'win32') skip('SKIPPED: temporarily skipped on Windows')
else testRun('npm run preview', { skipAboutPage: true, serverIsReadyMessage: 'Listening on:' })
