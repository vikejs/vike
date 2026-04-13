export { asyncFlatten }
export type { AsyncFlatten }

type AsyncFlatten<T extends unknown[]> = T extends (infer U)[] ? Exclude<Awaited<U>, U[]>[] : never

// Extracted from https://github.com/vitejs/vite/blob/bc5c6a7a498845dff20dc410c395355b79a4b753/packages/vite/src/node/utils.ts#L1515
async function asyncFlatten<T extends unknown[]>(arr: T): Promise<AsyncFlatten<T>> {
  do {
    arr = (await Promise.all(arr)).flat(Infinity) as any
  } while (arr.some((v: any) => v?.then))
  return arr as unknown[] as AsyncFlatten<T>
}
