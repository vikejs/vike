#!/usr/bin/env node

/**
 * Linting script to ensure all .ts files have an assertEnv*.ts import.
 *
 * This script checks that all TypeScript files in packages/vike/src import
 * the appropriate assertEnv*.ts file, with a whitelist for files that are
 * currently exempt from this requirement.
 */

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

// Whitelist patterns: files/directories that currently don't import assertEnv*.ts
// Supports glob patterns: '*' for single directory level, '**' for recursive
const WHITELIST_PATTERNS = [
  // Client-side code
  'packages/vike/src/client/**',

  // Node CLI and loaders
  'packages/vike/src/node/cli/**',

  // Node API
  'packages/vike/src/node/api/**',

  // Node Vite plugin
  'packages/vike/src/node/vite/**',

  // Prerender
  'packages/vike/src/node/prerender/**',

  // Shared server-client code (utils, types, configs)
  'packages/vike/src/shared-server-client/**',

  // Shared server-node code
  'packages/vike/src/shared-server-node/**',

  // Type definitions
  'packages/vike/src/types/**',

  // Utility functions
  'packages/vike/src/utils/**',

  // Single files
  'packages/vike/src/node/createDevMiddleware.ts',
]

function matchesPattern(filePath, pattern) {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.') // Escape dots
    .replace(/\*\*/g, '___DOUBLESTAR___') // Temporarily replace **
    .replace(/\*/g, '[^/]*') // * matches anything except /
    .replace(/___DOUBLESTAR___/g, '.*') // ** matches anything including /

  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(filePath)
}

function isWhitelisted(filePath) {
  return WHITELIST_PATTERNS.some((pattern) => matchesPattern(filePath, pattern))
}

function main() {
  // Find all .ts files in packages/vike/src, excluding test files and assertEnv files
  const findOutput = execSync(
    'find packages/vike/src -name "*.ts" -type f ! -name "*.spec.ts" ! -name "*.test.ts" ! -name "assertEnv*.ts"',
    { encoding: 'utf-8' },
  )
  const tsFiles = findOutput
    .trim()
    .split('\n')
    .filter((line) => line.length > 0)

  const filesWithoutImport = []
  const violations = []
  const whitelistedCount = 0

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf-8')

    // Check if file imports assertEnv*.ts
    const hasAssertEnvImport = /import\s+.*['"].*assertEnv.*\.js['"]/.test(content)

    if (!hasAssertEnvImport) {
      filesWithoutImport.push(file)

      // Check if this file is whitelisted
      if (!isWhitelisted(file)) {
        violations.push(file)
      }
    }
  }

  const whitelistedFilesCount = filesWithoutImport.filter((f) => isWhitelisted(f)).length

  // Report results
  console.log(`✓ Total .ts files checked: ${tsFiles.length}`)
  console.log(`✓ Files with assertEnv import: ${tsFiles.length - filesWithoutImport.length}`)
  console.log(`✓ Files without assertEnv import: ${filesWithoutImport.length}`)
  console.log(`✓ Whitelisted files: ${whitelistedFilesCount}`)

  if (violations.length > 0) {
    console.error(
      `\n❌ ERROR: ${violations.length} file(s) are missing assertEnv*.ts import and are not whitelisted:\n`,
    )
    violations.forEach((file) => {
      console.error(`  - ${file}`)
    })
    console.error(
      '\nPlease either:\n1. Add the appropriate assertEnv*.ts import to these files, or\n2. Add them to the WHITELIST_PATTERNS in scripts/lint-assertenv.js\n',
    )
    process.exit(1)
  }

  console.log('\n✅ All .ts files either have assertEnv*.ts import or are whitelisted.')
}

try {
  main()
} catch (err) {
  console.error('Error running lint-assertenv:', err)
  process.exit(1)
}
