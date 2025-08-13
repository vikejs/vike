export { cast }
export { castProp }

function cast<Type>(_thing: unknown): asserts _thing is Type {}

function castProp<PropType>(_obj: object, prop: PropertyKey): asserts _obj is Record<typeof prop, PropType> {}
