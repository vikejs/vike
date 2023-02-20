export function arrayIncludes<Arr extends any[] | readonly any[]>(arr: Arr, el: unknown): el is Arr[number] {
  return arr.includes(el as any)
}
