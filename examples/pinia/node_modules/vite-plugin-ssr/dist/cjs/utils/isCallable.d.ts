export { isCallable };
declare function isCallable<T extends (...args: unknown[]) => unknown>(thing: T | unknown): thing is T;
