import { expect, describe, it } from 'vitest'
import { freezePartial } from './freezePartial.js'
import pc from '@brillout/picocolors'

describe('freezePartial', () => {
  it('works', () => {
    const obj = {
      question: 42,
      changeme: 'hello',
    }
    freezePartial(obj, {
      changeme: (val) => ['bonjour', 'hello'].includes(val as any),
    })

    expect(obj.question).toBe(42)
    expect(() => {
      obj.question = 4
    }).toThrowError(`You aren't allowed to mutate property ${pc.cyan('question')}`)
    expect(obj.question).toBe(42)

    expect(() => {
      // @ts-ignore
      delete obj.question
    }).toThrowError("Cannot delete property 'question' of #<Object>")
    expect(() => {
      ;(obj as any).newProp = 11
    }).toThrowError('Cannot add property newProp, object is not extensible')

    expect(obj.changeme).toBe('hello')
    expect(() => {
      obj.changeme = 'abc'
    }).toThrowError(`Setting wrong value ${pc.cyan('"abc"')} for property ${pc.cyan('changeme')}`)
    obj.changeme = 'bonjour'
    expect(obj.changeme).toBe('bonjour')
  })
})
