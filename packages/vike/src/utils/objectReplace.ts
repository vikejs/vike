export function objectReplace<T extends object>(objOld: T, objNew: T, except?: string[]) {
  Object.keys(objOld)
    .filter((key) => !except?.includes(key))
    .forEach((key) => delete objOld[key as keyof typeof objOld])
  Object.defineProperties(objOld, Object.getOwnPropertyDescriptors(objNew))
}
