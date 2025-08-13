export { cast }
export { castProp }

function cast<T>(_thing: unknown): asserts _thing is T {}

function castProp<PropType>(_obj: object, prop: PropertyKey): asserts _obj is Record<typeof prop, PropType> {}
