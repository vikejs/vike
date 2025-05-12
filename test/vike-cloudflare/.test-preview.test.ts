import { testRun } from "./.testRun";

testRun("pnpm run preview --port 3000", {
  doNotFailOnWarning: true,
  serverIsReadyMessage: "Starting local server",
  serverIsReadyDelay: 2000,
  serverUrl: "http://127.0.0.1:3000",
});
