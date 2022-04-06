// Some tools don't support `package.json#exports`, such as:
//  - Nuxt v2
//  - Expo/Metro
//  - ESLint
// prettier-ignore
'use strict';
// prettier-ignore
exports.parse = require('./dist/cjs/index.js').parse;
exports.stringify = require('./dist/cjs/index.js').stringify;
