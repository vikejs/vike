"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCallable = void 0;
function isCallable(thing) {
    return thing instanceof Function || typeof thing === 'function';
}
exports.isCallable = isCallable;
