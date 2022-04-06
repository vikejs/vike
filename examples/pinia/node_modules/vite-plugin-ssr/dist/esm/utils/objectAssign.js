export { objectAssign };
// Same as `Object.assign()` but with type inference
function objectAssign(obj, objAddendum) {
    Object.assign(obj, objAddendum);
}
