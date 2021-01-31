import * as chokidar from "chokidar";
import { isAbsolute } from "path";
import { assert, assertUsage } from "./utils/assert";
import { findRootDir } from "./utils/findRootDir";

export { closeWatcher };
export { getUserFiles };

watchUserFiles();

async function getUserFiles() {
  const tsFiles = userFiles.filter(
    (path) => path.endsWith(".ts") || path.endsWith(".tsx")
  );
  const htmlFiles = userFiles.filter((path) => path.endsWith(".html"));

  // TODO
  //const jsFiles = userFiles.filter(path => path.endsWith('js') || path.endsWith('jsx'));

  return [...tsFiles, ...htmlFiles];
}

const userFiles: string[] = [];
let watcher: chokidar.FSWatcher;
async function watchUserFiles() {
  const rootDir = await findRootDir();
  assertUsage(rootDir, "Couldn't find user root directory.");

  if (!rootDir) return;

  const watchGlob = [
    rootDir + "/**/*.page.*",
    rootDir + "/**/*.config.*",
    rootDir + "/**/*.browser-entry.*",
    rootDir + "/**/*.html",
  ];

  const watcher = chokidar.watch(watchGlob, {
    ignored: ["**/node_modules/**", "**/.git/**"],
    ignoreInitial: false,
    ignorePermissionErrors: true,
  });

  watcher.on("ready", () =>
    console.log("Initial scan complete. Ready for changes")
  );

  watcher.on("add", (path) => {
    assert(isAbsolute(path));
    userFiles.push(path);
  });
  watcher.on("unlink", (path) => {
    const idx = userFiles.indexOf(path);
    assert(idx >= 0);
    userFiles.splice(idx, 1);
  });
}
async function closeWatcher() {
  if (!watcher) return;
  await watcher.close();
}
