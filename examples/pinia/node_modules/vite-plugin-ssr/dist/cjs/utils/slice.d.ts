export { slice };
declare function slice<Element, T extends Array<Element>>(thing: T, from: number, to: number): T;
declare function slice(thing: string, from: number, to: number): string;
