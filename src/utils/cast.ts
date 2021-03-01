export { cast }

function cast<T>(thing: unknown): asserts thing is T {}
