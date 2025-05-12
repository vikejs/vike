import { testRun } from "./.testRun";

process.env.VITE_CONFIG = "{server:{port:3000}}";
testRun("pnpm run dev", {
  serverIsReadyMessage: "Server running",
});
