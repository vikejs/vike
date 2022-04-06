"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectAssign = void 0;
// Same as `Object.assign()` but with type inference
function objectAssign(obj, objAddendum) {
    Object.assign(obj, objAddendum);
}
exports.objectAssign = objectAssign;
