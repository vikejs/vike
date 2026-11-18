import { expect, describe, it } from 'vitest'
import { resolveUrlPathname } from './resolveUrlPathname'

describe('resolveUrlPathname', () => {
  it('basics', () => {
    expect(resolveUrlPathname('/', {})).toEqual('/')
    expect(resolveUrlPathname('/a', {})).toEqual('/a')
    expect(resolveUrlPathname('/@a', { a: '1' })).toEqual('/1')
  })

  it('edge cases', () => {
    expect(resolveUrlPathname('/@a', { a: 'a' })).toEqual('/a')
    expect(resolveUrlPathname('/@a/@b', { a: '@b', b: '1' })).toEqual('/@b/1')
    expect(resolveUrlPathname('/@a/*', { a: '*', '*': '1' })).toEqual('/*/1')
    expect(resolveUrlPathname('/*', { '*': '*' })).toEqual('/*')
  })

  it('parameter name that is a prefix of another parameter name', () => {
    expect(resolveUrlPathname('/posts/@pageId', { page: 'a', pageId: '42' })).toEqual('/posts/42')
    expect(resolveUrlPathname('/@page/@pageId', { page: 'a', pageId: '42' })).toEqual('/a/42')
  })

  // Not implemented yet
  // it('multiple globs', () => {
  //   expect(resolveUrlPathname('/*/*', { '*1': '*2', '*2': '*' })).toEqual('/*2/*')
  // })
})
