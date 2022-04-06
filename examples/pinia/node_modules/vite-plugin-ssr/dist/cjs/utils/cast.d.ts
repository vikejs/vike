export { cast };
export { castProp };
declare function cast<T>(_thing: unknown): asserts _thing is T;
declare function castProp<PropType, ObjectType, PropName extends PropertyKey>(_obj: ObjectType, _prop: PropName): asserts _obj is ObjectType & Record<PropName, PropType>;
