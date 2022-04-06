"use strict";
// Prevent XSS attacks, see https://github.com/brillout/vite-plugin-ssr/pull/181#issuecomment-952846026
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeJson = void 0;
function sanitizeJson(unsafe) {
    const safe = unsafe.replace(/</g, '\\u003c');
    return safe;
}
exports.sanitizeJson = sanitizeJson;
