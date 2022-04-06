export { isObjectWithKeys };
declare function isObjectWithKeys<Keys extends readonly string[]>(obj: unknown, keys: Keys): obj is {
    [key in Keys[number]]?: unknown;
};
