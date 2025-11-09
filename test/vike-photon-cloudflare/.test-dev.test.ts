import { testRun } from "./.testRun";

process.env.NODE_ENV = "development";
testRun("pnpm run dev");
