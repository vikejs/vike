export function escapeRegex(str: string): string {
  // https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
  return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
}
