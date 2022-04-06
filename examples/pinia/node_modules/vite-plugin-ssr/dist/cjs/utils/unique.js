"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = void 0;
function unique(arr) {
    return Array.from(new Set(arr));
}
exports.unique = unique;
