import { execSync } from 'child_process'

// https://jestjs.io/docs/configuration#testregex-string--arraystring
const testRE = /\/__tests__\/.*|(\.|\/)(test|spec)\.[jt]sx?$/

function cmd(command, { cwd, result }) {
  let stdout = execSync(command, { encoding: 'utf8', cwd, shell: true })
  const words = stdout.split(/\s/).filter(Boolean)
  if (result === 'single') {
    return words[0]
  }
  if (result === 'many') {
    return words
  }
}

const root = cmd('git rev-parse --show-toplevel', { result: 'single' })
const projectFiles = cmd(`git ls-files`, { cwd: root, result: 'many' })
const testFiles = projectFiles.filter((file) => testRE.test(file))

const matrix = [
  {
    name: 't1',
    SINGLE_TEST: 'examples/vuex/.test.spec.ts',
    os: 'ubuntu-latest',
    node_version: '16',
  },
  {
    name: 't2',
    SINGLE_TEST: 'TYPESCRIPT',
    os: 'ubuntu-latest',
    node_version: '18',
  },
]

/*
console.log(testFiles)
testFiles.forEach((testFile) => {})
//*/

console.log(`{"include":${JSON.stringify(matrix)}}`)
