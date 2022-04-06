export { isCallable };
function isCallable(thing) {
    return thing instanceof Function || typeof thing === 'function';
}
