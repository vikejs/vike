export { hasProp }
export type { ResolveTypeAsString }

import { isCallable } from './isCallable.js'
import { isObject } from './isObject.js'
import { isArrayOfStrings } from './isArrayOfStrings.js'
import { isObjectOfStrings } from './isObjectOfStrings.js'
import { isArray } from './isArray.js'

type TypeAsString =
  | 'object'
  | 'string{}'
  | 'string[]'
  | 'array'
  | 'function'
  | 'number'
  | 'string'
  | 'boolean'
  | 'true'
  | 'false'
  | 'null'
  | 'undefined'
  | undefined

type ResolveTypeAsString<Type extends TypeAsString = undefined> =
  //
  Type extends 'object'
    ? Record<string, unknown>
    : Type extends 'string{}'
      ? Record<string, string>
      : Type extends 'string[]'
        ? string[]
        : Type extends 'array'
          ? unknown[]
          : Type extends 'function'
            ? (...args: any[]) => unknown
            : Type extends 'number'
              ? number
              : Type extends 'string'
                ? string
                : Type extends 'boolean'
                  ? boolean
                  : Type extends 'true'
                    ? true
                    : Type extends 'false'
                      ? false
                      : Type extends 'null'
                        ? null
                        : Type extends 'undefined'
                          ? undefined
                          : Type extends undefined
                            ? unknown
                            : never

function hasProp<ObjectType, PropName extends PropertyKey, Type extends TypeAsString = undefined>(
  obj: ObjectType,
  prop: PropName,
  type?: Type,
): obj is ObjectType & Record<PropName, ResolveTypeAsString<Type>>
function hasProp<ObjectType, PropName extends PropertyKey, Enum>(
  obj: ObjectType,
  prop: PropName,
  type: Enum[],
): obj is ObjectType & Record<PropName, Enum>
function hasProp(
  obj: Record<string, unknown>,
  prop: string,
  type?:
    | TypeAsString
    //  Enum[]
    | string[],
): boolean {
  if (!isObject(obj)) return false
  if (!(prop in obj)) {
    return type === 'undefined'
  }
  if (type === undefined) {
    return true
  }
  const propValue = (obj as Record<any, unknown>)[prop]
  if (type === 'undefined') {
    return propValue === undefined
  }
  if (type === 'array') {
    return isArray(propValue)
  }
  if (type === 'object') {
    return isObject(propValue)
  }
  if (type === 'string[]') {
    return isArrayOfStrings(propValue)
  }
  if (type === 'string{}') {
    return isObjectOfStrings(propValue)
  }
  if (type === 'function') {
    return isCallable(propValue)
  }
  if (isArray(type)) {
    return typeof propValue === 'string' && type.includes(propValue)
  }
  if (type === 'null') {
    return propValue === null
  }
  if (type === 'true') {
    return propValue === true
  }
  if (type === 'false') {
    return propValue === false
  }
  return typeof propValue === type
}
