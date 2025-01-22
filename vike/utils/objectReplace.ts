export function objectReplace(obj: object, objNew: object, except?: string[]) {
  Object.keys(obj)
    .filter((key) => !except?.includes(key))
    .forEach((key) => delete obj[key as keyof typeof obj])
  Object.assign(obj, objNew)
}
