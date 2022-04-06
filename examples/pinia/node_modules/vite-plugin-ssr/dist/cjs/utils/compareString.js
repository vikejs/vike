"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareString = void 0;
function compareString(str1, str2) {
    if (str1.toLowerCase() < str2.toLowerCase())
        return -1;
    if (str1.toLowerCase() > str2.toLowerCase())
        return 1;
    return 0;
}
exports.compareString = compareString;
