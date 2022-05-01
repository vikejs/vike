#!/usr/bin/env zx

/*
const projectFiles = (await quiet($`ls examples/`)).stdout.split(/\s/).filter(Boolean)
console.log(projectFiles)

const testFiles = projectFiles.filte

// Jest default regex pattern: https://jestjs.io/docs/configuration#testregex-string--arraystring
// (/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$

/*
let tests = (await quiet($`ls examples/`)).stdout.split(/\s/).filter(Boolean)

const matrix = tests.map(test => {
  return { project: test, config: 'bla2' }
})
*/

const matrix = [
  {
    SINGLE_TEST: './examples/vuex/.test.spec.ts',
    os: 'ubuntu-latest',
    node_version: '16'
  },
  {
    SINGLE_TEST: 'TYPESCRIPT',
    os: 'ubuntu-latest',
    node_version: '18'
  }
]

console.log(`{"include":${JSON.stringify(matrix)}}`)
