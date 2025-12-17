// https://stackoverflow.com/questions/56565528/typescript-const-assertions-how-to-use-array-prototype-includes/74213179#74213179
/** Same as Array.prototype.includes() but with type inference */
export function includes<T>(values: readonly T[], x: unknown): x is T {
  return values.includes(x as any)
}
/*
export function includes<Arr extends any[] | readonly any[]>(arr: Arr, el: unknown): el is Arr[number] {
  return arr.includes(el as any)
}
*/
