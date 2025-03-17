export function checkType<Type>(_: Type) {}
export function castType<Cast, Type = {}>(_: Type): asserts _ is Type & Cast {}
