export function objectReplace(obj: object, objNew: object) {
  Object.keys(obj).forEach((key) => delete obj[key as keyof typeof obj])
  Object.assign(obj, objNew)
}
