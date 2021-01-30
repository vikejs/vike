import {
  parse as pathParse,
  join as pathJoin,
  dirname as pathDirname,
} from "path";

export { findUp };

async function findUp(
  filename: string,
  fromDir: string
): Promise<null | string> {
  const rootDir = pathRootDir(fromDir);

  let currentDir = fromDir;
  for (let i = 0; i < 99; i++) {
    const candidatePath = pathJoin(currentDir, filename);

    let found;
    try {
      found = require.resolve(candidatePath);
    } catch (_) {}
    if (found) return found;

    currentDir = pathDirname(currentDir);
    if (currentDir === rootDir) return null;
  }

  return null;
}

function pathRootDir(path: string): string {
  const { root } = pathParse(path);
  return root;
}
