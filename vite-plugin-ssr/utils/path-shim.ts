// export { isAbsolute, join, joinSimple }
 export { joinSimple }

import {assert} from "./assert";

function isAbsolute(path: string): boolean {
  return /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/.test(path)
}

// normalize
export const normalize = function (path: string) {
  if (path.length === 0) {
    return ".";
  }

  const isPathAbsolute = isAbsolute(path);
  const trailingSeparator = path[path.length - 1] === "/";

  // Normalize the path
  path = normalizeString(path, !isPathAbsolute);

  if (path.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path += "/";
  }

  return isPathAbsolute && !isAbsolute(path) ? `/${path}` : path;
};

function joinSimple(path1: string, path2: string): string {
  assert(!path1.includes(('\\')))
  assert(!path2.includes(('\\')))
  let pathJoined = [...path1.split('/'), ...path2.split('/')].filter(Boolean).join('/')
  if (path1.startsWith('/')) pathJoined = '/' + pathJoined
  return pathJoined
}

// join
const join = function (...arguments_: string[]) {
  if (arguments_.length === 0) {
    return ".";
  }

  let joined: string | undefined;
  for (const argument of arguments_) {
    if (argument && argument.length > 0) {
      if (joined === undefined) {
        joined = argument;
      } else {
        joined += `/${argument}`;
      }
    }
  }
  if (joined === undefined) {
    return ".";
  }

  return normalize(joined.replace(/\/\/+/g, "/"));
};

// Resolves . and .. elements in a path with directory names
export function normalizeString(path: string, allowAboveRoot: boolean) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char: string | null = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index] as string;
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) {
        // NOOP
      } else if (dots === 2) {
        if (
          res.length < 2 ||
          lastSegmentLength !== 2 ||
          res[res.length - 1] !== "." ||
          res[res.length - 2] !== "."
        ) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
