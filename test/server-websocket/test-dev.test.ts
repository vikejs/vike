import { test, editFile, editFileRevert } from '@brillout/test-e2e'
import { sleepBeforeEditFile } from '../utils'
import { testRun, testWebSocket } from './.testRun'

testRun('pnpm run dev')

test('upgrade() is re-run upon +server.ts modification', async () => {
  await sleepBeforeEditFile()
  editFile('./+server.ts', (s) => s.replace('echo: ', 'modified echo: '))
  // No page.goto(): modifying +server.ts reloads the page
  await testWebSocket('modified echo: hello')
  await sleepBeforeEditFile()
  editFileRevert()
  await testWebSocket('echo: hello')
})
