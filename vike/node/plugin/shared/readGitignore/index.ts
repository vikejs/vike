export { getGitignoreLines, readAndSetGitignoreLines, parseGitignore }

import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { getGlobalObject, unique } from '../../utils.js'

const globalObject = getGlobalObject<{
  lines: string[]
  globs: { include: string[]; exclude: string[] }
}>('readGitignore.ts', { lines: [], globs: { include: [], exclude: [] } })

function getGitignoreLines() {
  return globalObject
}

async function readAndSetGitignoreLines(userRootDir: string) {
  const res = await readdir(userRootDir)
  const gitignoreFile = res.find((fname) => fname.toLowerCase() === '.gitignore')
  if (gitignoreFile) {
    const content = await readFile(join(userRootDir, gitignoreFile), 'utf8')
    const result = parseGitignore(content)
    globalObject.lines = result.lines
    globalObject.globs = result.globs
    return result
  }
}

function parseGitignore(content: string) {
  const lines = content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length && !line.startsWith('#'))

  const uniqueLines = unique(lines)
  const includeLines: string[] = []
  const excludeLines: string[] = []
  function addLine(line: string, include: boolean) {
    if (include) {
      includeLines.push(line)
    } else {
      excludeLines.push(line)
    }
  }
  for (let line of uniqueLines) {
    let include = false
    if (line.startsWith('!')) {
      line = line.substring(1)
      include = true
    }

    const slashPosBefore = line.indexOf('/')

    if (line.startsWith('/')) {
      line = line.substring(1)
    }

    if (line.endsWith('/')) {
      line = `${line}**`
    }

    const slashPosAfter = line.indexOf('/')
    if (slashPosAfter === -1) {
      const startsWithAsterisk = line.startsWith('*')
      const endWithAsterisk = line.endsWith('*')
      while (line.startsWith('*')) line = line.substring(1)
      while (line.endsWith('*')) line = line.slice(0, -1)
      const lastDot = line.lastIndexOf('.')
      const startsWithDot = line.startsWith('.')
      if (endWithAsterisk) {
        addLine(`**/${line}.*`, include)
      }
      if (slashPosBefore === -1) {
        if (lastDot !== -1 && lastDot !== 0) {
          addLine(`**/*${startsWithDot ? '' : '.'}${line}`, include)
        }
        if (startsWithAsterisk) {
          addLine(`**/*${line}*`, include)
        } else if (endWithAsterisk) {
          addLine(`**/${line}.*/**`, include)
        }
        line = `**/${line}/**`
      }
    }

    addLine(line, include)
  }

  return { lines: uniqueLines, globs: { include: unique(includeLines), exclude: unique(excludeLines) } }
}
