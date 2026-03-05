export { asyncFlatten }
export type { AsyncFlatten }

type AsyncFlatten<T extends unknown[]> = T extends (infer U)[] ? Exclude<Awaited<U>, U[]>[] : never

async function asyncFlatten<T extends unknown[]>(arr: T): Promise<AsyncFlatten<T>> {
  do {
    arr = (await Promise.all(arr)).flat(Infinity) as any
  } while (arr.some((v: any) => v?.then))
  return arr as unknown[] as AsyncFlatten<T>
}
