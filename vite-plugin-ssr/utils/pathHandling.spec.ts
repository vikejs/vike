import { pathJoin, pathIsAbsolute, pathRelative } from './pathHandling'
import { expect, describe, it } from 'vitest'
import path from 'path'

describe('pathHandling', () => {
  it('pathIsAbsolute', () => {
    expect(pathIsAbsolute('/a')).toBe(true)
    expect(pathIsAbsolute('/a/b')).toBe(true)
    expect(pathIsAbsolute('./a')).toBe(false)
    expect(pathIsAbsolute('../a')).toBe(false)
    expect(pathIsAbsolute('a')).toBe(false)
    expect(pathIsAbsolute('a/')).toBe(false)
    expect(pathIsAbsolute('a/b')).toBe(false)
  })
  it('pathIsAbsolute - better than Node.js', () => {
    expect(path.isAbsolute('E:/Projects/vite-ssr-test/dist/server')).toBe(process.platform === 'win32')
    expect(pathIsAbsolute('E:/Projects/vite-ssr-test/dist/server')).toBe(true)
    expect(pathIsAbsolute('a:/b')).toBe(true)
    expect(pathIsAbsolute('a/b')).toBe(false)
    expect(pathIsAbsolute('a:/')).toBe(true)
    expect(pathIsAbsolute('a/')).toBe(false)
  })

  it('pathJoin', () => {
    expect(pathJoin('/a/', './b')).toBe('/a/b')
    expect(pathJoin('/a', './b')).toBe('/a/b')
    expect(pathJoin('a', 'b')).toBe('a/b')
    expect(pathJoin('a/b/', './c')).toBe('a/b/c')
    expect(pathJoin('a/b/', './c')).toBe('a/b/c')
  })
  it('pathJoin - better than Node.js', () => {
    expect(path.posix.join('/a', '/b')).toBe('/a/b')
    let err: Error
    try {
      pathJoin('/a', '/b')
    } catch (err_) {
      err = err_
    }
    expect(err.message).toBe('Cannot join two absolute paths')
  })

  it('pathRelative', () => {
    expect(pathRelative('/a/b/', '/a/c')).toBe('../c')
  })

  it('pathRelative - better than Node.js', () => {
    // expect(path.posix.relative('/a', './b')).toBe(__dirname)
    let err: Error
    try {
      pathRelative('/a', './b')
    } catch (err_) {
      err = err_
    }
    expect(err.message).toBe('A relative path can only be computed from two absolute paths')
  })
})
