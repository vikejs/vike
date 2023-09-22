export { getRandomId }

import { assert } from './assert.js'

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

function getRandomId(length: number): string {
  let randomId = ''
  while (randomId.length < length) {
    randomId += Math.random().toString(36).slice(2)
  }
  randomId = randomId.slice(0, length)
  assert(/^[a-z0-9]+$/.test(randomId) && randomId.length === length)
  return randomId
}
