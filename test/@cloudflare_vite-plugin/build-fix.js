import { readFileSync, writeFileSync } from 'node:fs'

const wranglerJsonPath = './dist/server/wrangler.json'
const wranglerJson = JSON.parse(readFileSync(wranglerJsonPath))
wranglerJson.main = '../worker/index.js'
writeFileSync(wranglerJsonPath, JSON.stringify(wranglerJson, null, 2))
