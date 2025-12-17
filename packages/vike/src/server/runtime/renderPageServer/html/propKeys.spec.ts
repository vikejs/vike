import { getPropKeys } from './propKeys'
import { describe, it, expect } from 'vitest'

describe('getPropKeys', () => {
  it('splits on dots when no escape is present', () => {
    expect(getPropKeys('foo.bar.baz')).toEqual(['foo', 'bar', 'baz'])
  })

  it('preserves escaped dots (default \\ escape)', () => {
    expect(getPropKeys('foo\\.bar.baz')).toEqual(['foo.bar', 'baz'])
  })

  it('handles multiple escaped dots', () => {
    expect(getPropKeys('foo\\.bar\\.baz.qux')).toEqual(['foo.bar.baz', 'qux'])
  })

  it('does not split on double escape sequences', () => {
    expect('a\\\\b').toEqual('a\\\\b')
    expect(getPropKeys('a\\\\b')).toEqual(['a\\\\b'])
    expect(getPropKeys('a\\\\.b')).toEqual(['a\\.b'])
    expect(getPropKeys('a\\\\\\.b')).toEqual(['a\\\\.b'])
    expect(getPropKeys('a\\\\\\\\.b')).toEqual(['a\\\\\\.b'])

    expect(getPropKeys('foo\\\\.bar')).toEqual(['foo\\.bar'])
    expect('foo\\\\.bar').toEqual('foo\\\\.bar')
    expect(getPropKeys('foo\\\\.bar')).toEqual(['foo\\.bar'])
    expect('foo\\\\.bar.baz').toEqual('foo\\\\.bar.baz')
    expect(getPropKeys('foo\\\\.bar.baz')).toEqual(['foo\\.bar', 'baz'])
  })

  it('handles input without dots correctly', () => {
    expect(getPropKeys('foobar')).toEqual(['foobar'])
  })

  it('handles leading and trailing dots', () => {
    expect(getPropKeys('.foo.bar.')).toEqual(['', 'foo', 'bar', ''])
  })

  it('handles consecutive dots', () => {
    expect(getPropKeys('foo..bar')).toEqual(['foo', '', 'bar'])
  })

  it('handles only escaped dots', () => {
    expect(getPropKeys('foo\\.bar\\.baz')).toEqual(['foo.bar.baz'])
  })

  it('supports escaping dots at start and end', () => {
    expect(getPropKeys('\\.foo\\.bar\\.')).toEqual(['.foo.bar.'])
  })
})
