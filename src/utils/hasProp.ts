export { hasProp }

// prettier-ignore
function hasProp<ObjectType, PropName extends PropertyKey>(obj: ObjectType, prop: PropName, type: 'boolean'):  obj is ObjectType & Record<PropName, boolean>;
// prettier-ignore
function hasProp<ObjectType, PropName extends PropertyKey>(obj: ObjectType, prop: PropName, type: 'number'):  obj is ObjectType & Record<PropName, number>;
// prettier-ignore
function hasProp<ObjectType, PropName extends PropertyKey>(obj: ObjectType, prop: PropName, type: 'string'): obj is ObjectType & Record<PropName, string>;
// prettier-ignore
function hasProp<ObjectType, PropName extends PropertyKey>(obj: ObjectType, prop: PropName, type: 'object'): obj is ObjectType & Record<PropName, Record<string, unknown>>;
// prettier-ignore
function hasProp<ObjectType, PropName extends PropertyKey>(obj: ObjectType, prop: PropName, type: 'string[]'): obj is ObjectType & Record<PropName, string[]>;
// prettier-ignore
function hasProp<ObjectType, PropName extends PropertyKey>(obj: ObjectType, prop: PropName): obj is ObjectType & Record<PropName, unknown>;
// prettier-ignore
function hasProp<ObjectType, PropName extends PropertyKey>(obj: ObjectType, prop: PropName, type: string = 'unknown'): boolean {
  const propExists = typeof obj === 'object' && obj !== null && prop in obj
  if( type === 'unknown' ) {
    return propExists
  }
  if( type === 'string[]') {
    return propExists && Array.isArray(obj) && obj.every(el => typeof el === 'string')
  }
  return propExists && typeof (obj as Record<any,unknown>)[prop] === type;
}

// Resources:
//  - https://2ality.com/2020/06/type-guards-assertion-functions-typescript.html
//  - https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABDAzgFQJ4AcCmdgAUAbgIYA2IOAXIiWBgDSJTbWIDkARnHGTnewCUNUhRzIUibr35gA3AFgAUKEiwEEzLnzFylGnUbNWNdmBABbTjgBOQkXvGpE5q7cUrw0eElRa8hKL6tPRMLLimKFA2MGAA5vaIQU6SUTHxHqreGn6sOskGocYRHOAA1mBwAO5gickSiOWVNZle6r7oeYGOhUbhbGmxcYgAvKVgFdW1wlI8fHSIAN7KiMiExeIjW+OTNeyIgksrq4g2OFAgNkjRlMcAvsdnF1cb+EmOo9v9Hg9KyhAIKK0GhNKajRAAFgATMplCQUChbFACLltIQSEwzJZrHZBIJ-oCZAA6MhwOIEEj4v6eNQ+WgIpEEAFgAAmMHaIImzTAM3hiJsUEkzLZ7SOShOa0QTIQIp8hyelzAx1WUAAFjZqi4cFVEABRGwamwEdgAQQZArpADESDAyEJlHcgA
