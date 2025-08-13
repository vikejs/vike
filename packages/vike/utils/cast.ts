export { cast }
export { castProp }

function cast<T>(_thing: unknown): asserts _thing is T {}

function castProp<PropType>(
  obj: object,
  prop: PropertyKey,
): asserts obj is Record<typeof prop, PropType> & typeof obj {}
