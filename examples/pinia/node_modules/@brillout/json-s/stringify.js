// Some tools don't support `package.json#exports`, such as:
//  - Nuxt v2
//  - Expo/Metro
//  - ESLint
// prettier-ignore
'use strict';
// prettier-ignore
exports.stringify = require('./dist/cjs/stringify.js').stringify;
