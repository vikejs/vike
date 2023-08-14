export { objectEntries }

// https://stackoverflow.com/questions/60141960/typescript-key-value-relation-preserving-object-entries-type/75337277#75337277

type ValueOf<T> = T[keyof T]
type Entries<T> = [keyof T, ValueOf<T>][]

// Same as `Object.entries()` but with type inference
function objectEntries<T extends object>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>
}
