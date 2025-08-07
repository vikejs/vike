import { testRun } from "./.testRun";

testRun('pnpm run dev', {
  serverIsReadyMessage: 'Server running',
  hasServer: true,
})
