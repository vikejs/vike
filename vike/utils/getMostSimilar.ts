export { getMostSimilar }

import { assert } from './assert.js'
import { higherFirst } from './sorter.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'

assertIsNotBrowser()

function getMostSimilar(word: string, words: string[]): null | string {
  if (words.length === 0) return null

  const exactMatch = words.find((w) => w === word)
  if (exactMatch) return exactMatch

  const lowerCaseMatch = words.find((w) => w.toLowerCase() === word.toLowerCase())
  if (lowerCaseMatch) return lowerCaseMatch

  const mostSimilar = words
    .map((w) => ({
      word: w,
      similarity: getSimilarity(w, word)
    }))
    .sort(higherFirst(({ similarity }) => similarity))[0]
  assert(mostSimilar)

  if (mostSimilar.similarity >= 0.8) {
    return mostSimilar.word
  } else {
    return null
  }
}

// https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely/36566052#36566052
function getSimilarity(s1: string, s2: string): number {
  var longer = s1
  var shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  var longerLength = longer.length
  if (longerLength == 0) {
    return 1.0
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength
}

function editDistance(s1: string, s2: string): number {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  var costs = new Array()
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j
      else {
        if (j > 0) {
          var newValue = costs[j - 1]
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}
