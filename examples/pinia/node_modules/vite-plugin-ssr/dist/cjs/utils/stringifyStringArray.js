"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyStringArray = void 0;
function stringifyStringArray(stringList) {
    return '[' + stringList.map((str) => "'" + str + "'").join(', ') + ']';
}
exports.stringifyStringArray = stringifyStringArray;
