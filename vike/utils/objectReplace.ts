export function objectReplace<T extends object>(obj: T, objNew: T, except?: string[]) {
  Object.keys(obj)
    .filter((key) => !except?.includes(key))
    .forEach((key) => delete obj[key as keyof typeof obj])
  Object.assign(obj, objNew)
}
