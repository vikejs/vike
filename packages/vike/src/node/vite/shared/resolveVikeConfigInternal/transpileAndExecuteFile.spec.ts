import { afterEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { transpileAndExecuteFile } from './transpileAndExecuteFile.js'
import type { FilePathResolved } from '../../../../types/FilePath.js'
import type { EsbuildCache } from './transpileAndExecuteFile.js'

const tmpDirs: string[] = []

afterEach(() => {
  vi.restoreAllMocks()
  tmpDirs.forEach((tmpDir) => {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  })
  tmpDirs.length = 0
})

describe('transpileAndExecuteFile()', () => {
  it('sets source map metadata for runtime errors in the main config file', async () => {
    const userRootDir = createTmpDir()
    fs.mkdirSync(path.posix.join(userRootDir, 'node_modules'))
    const configFilePath = path.posix.join(userRootDir, '+config.ts')
    fs.writeFileSync(configFilePath, "throw new Error('probe')\n")

    let vikeTempFilePath: string | undefined
    const writeFileSyncOriginal = fs.writeFileSync
    const writeFileSync = vi.spyOn(fs, 'writeFileSync')
    writeFileSync.mockImplementation((file, data, options) => {
      const filePath = String(file)
      if (filePath.includes('/node_modules/.vike-temp/+config.ts.build-')) {
        vikeTempFilePath = filePath
      }
      return writeFileSyncOriginal.call(fs, file, data, options)
    })

    let err: unknown
    try {
      await transpileAndExecuteFile(
        getFilePathResolved(configFilePath, userRootDir),
        userRootDir,
        false,
        getEsbuildCache(),
      )
    } catch (err_) {
      err = err_
    }

    expect(err).toBeInstanceOf(Error)
    expect(vikeTempFilePath).toBeDefined()
    const sourceMap = getInlineSourceMap(writeFileSync.mock.calls, vikeTempFilePath!)
    expect(sourceMap.sources).toContain(configFilePath)
    expect(sourceMap.sourceRoot).toBeUndefined()
  })
  it('executes transpiled config files from node_modules/.vike-temp with original file-scope values', async () => {
    const userRootDir = createTmpDir()
    fs.mkdirSync(path.posix.join(userRootDir, 'node_modules'))
    const configFilePath = path.posix.join(userRootDir, '+config.ts')
    fs.writeFileSync(
      configFilePath,
      [
        'export const values = {',
        '  importMetaUrl: import.meta.url,',
        '  importMetaDirname: import.meta.dirname,',
        '  importMetaFilename: import.meta.filename,',
        '  importMetaMain: import.meta.main,',
        "  importMetaResolve: import.meta.resolve('./config-data.txt'),",
        '  dirname: __dirname,',
        '  filename: __filename,',
        '}',
      ].join('\n'),
    )

    const writtenFiles: string[] = []
    const writeFileSyncOriginal = fs.writeFileSync
    const writeFileSync = vi.spyOn(fs, 'writeFileSync')
    writeFileSync.mockImplementation((file, data, options) => {
      writtenFiles.push(String(file))
      return writeFileSyncOriginal.call(fs, file, data, options)
    })

    const { fileExports } = await transpileAndExecuteFile(
      getFilePathResolved(configFilePath, userRootDir),
      userRootDir,
      false,
      getEsbuildCache(),
    )

    expect(writtenFiles.some((file) => file.includes('/node_modules/.vike-temp/+config.ts.build-'))).toBe(true)
    expect(fileExports.values).toEqual({
      importMetaUrl: `file://${configFilePath}`,
      importMetaDirname: userRootDir,
      importMetaFilename: configFilePath,
      importMetaMain: false,
      importMetaResolve: `file://${userRootDir}/config-data.txt`,
      dirname: userRootDir,
      filename: configFilePath,
    })
  })
  it('sets source map metadata for runtime errors in bundled relative modules', async () => {
    const userRootDir = createTmpDir()
    fs.mkdirSync(path.posix.join(userRootDir, 'node_modules'))
    const configFilePath = path.posix.join(userRootDir, '+config.ts')
    const importedFilePath = path.posix.join(userRootDir, 'config-stack-trace-probe.ts')
    fs.writeFileSync(configFilePath, "import './config-stack-trace-probe'\n")
    fs.writeFileSync(importedFilePath, "throw new Error('probe')\n")

    let vikeTempFilePath: string | undefined
    const writeFileSyncOriginal = fs.writeFileSync
    const writeFileSync = vi.spyOn(fs, 'writeFileSync')
    writeFileSync.mockImplementation((file, data, options) => {
      const filePath = String(file)
      if (filePath.includes('/node_modules/.vike-temp/+config.ts.build-')) {
        vikeTempFilePath = filePath
      }
      return writeFileSyncOriginal.call(fs, file, data, options)
    })

    let err: unknown
    try {
      await transpileAndExecuteFile(
        getFilePathResolved(configFilePath, userRootDir),
        userRootDir,
        false,
        getEsbuildCache(),
      )
    } catch (err_) {
      err = err_
    }

    expect(err).toBeInstanceOf(Error)

    expect(vikeTempFilePath).toBeDefined()
    const sourceMap = getInlineSourceMap(writeFileSync.mock.calls, vikeTempFilePath!)
    expect(sourceMap.sources).toContain(importedFilePath)
    expect(sourceMap.sources).toContain(configFilePath)
    expect(sourceMap.sourceRoot).toBeUndefined()
  })
  it('falls back to the next-to-source artifact path when node_modules/.vike-temp cannot be written', async () => {
    const userRootDir = createTmpDir()
    fs.mkdirSync(path.posix.join(userRootDir, 'node_modules'))
    const configFilePath = path.posix.join(userRootDir, '+config.ts')
    fs.writeFileSync(configFilePath, 'export const value = 42\n')

    const writtenFiles: string[] = []
    const writeFileSyncOriginal = fs.writeFileSync
    const writeFileSync = vi.spyOn(fs, 'writeFileSync')
    writeFileSync.mockImplementation((file, data, options) => {
      const filePath = String(file)
      if (filePath.includes('/node_modules/.vike-temp/')) {
        const err = new Error('read-only node_modules') as NodeJS.ErrnoException
        err.code = 'EROFS'
        throw err
      }
      writtenFiles.push(filePath)
      return writeFileSyncOriginal.call(fs, file, data, options)
    })

    const { fileExports } = await transpileAndExecuteFile(
      getFilePathResolved(configFilePath, userRootDir),
      userRootDir,
      false,
      getEsbuildCache(),
    )

    expect(fileExports.value).toBe(42)
    expect(writtenFiles.some((file) => file.includes('/node_modules/.vike-temp/'))).toBe(false)
    expect(writtenFiles.some((file) => file.includes('/+config.ts.build-'))).toBe(true)
  })
})

function createTmpDir(): string {
  const tmpDir = fs.mkdtempSync(path.posix.join(os.tmpdir(), 'vike-transpile-test-'))
  tmpDirs.push(tmpDir)
  return tmpDir
}

function getFilePathResolved(filePathAbsoluteFilesystem: string, userRootDir: string): FilePathResolved {
  const filePathAbsoluteUserRootDir = filePathAbsoluteFilesystem.slice(userRootDir.length)
  return {
    filePathAbsoluteFilesystem,
    filePathToShowToUserResolved: filePathAbsoluteUserRootDir,
    fileName: path.posix.basename(filePathAbsoluteFilesystem),
    filePathAbsoluteUserRootDir,
    importPathAbsolute: null,
    filePathToShowToUser: filePathAbsoluteUserRootDir,
    filePathAbsoluteVite: filePathAbsoluteUserRootDir,
  }
}

function getEsbuildCache(): EsbuildCache {
  return {
    transpileCache: {},
    vikeConfigDependencies: new Set(),
  }
}

function getInlineSourceMap(
  writeFileSyncCalls: unknown[][],
  filePath: string,
): { sourceRoot?: string; sources: string[] } {
  const writeFileSyncCall = writeFileSyncCalls.find(([file]) => file === filePath)
  expect(writeFileSyncCall).toBeDefined()
  const code = writeFileSyncCall![1]
  expect(typeof code).toBe('string')
  const match = (code as string).match(/\/\/# sourceMappingURL=data:application\/json;base64,([A-Za-z0-9+/=]+)\s*$/)
  expect(match).toBeTruthy()
  return JSON.parse(Buffer.from(match![1]!, 'base64').toString('utf-8'))
}
