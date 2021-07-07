export { filter }

// https://stackoverflow.com/questions/66341757/typescript-how-to-filter-the-object
function filter<T extends object>(
  obj: T,
  predicate: <K extends keyof T>(value: T[K], key: K) => boolean
): T {
  const result: { [K in keyof T]?: T[K] } = {};
  (Object.keys(obj) as Array<keyof T>).forEach((name) => {
    if (predicate(obj[name], name)) {
      result[name] = obj[name];
    }
  });
  return result as T;
}
