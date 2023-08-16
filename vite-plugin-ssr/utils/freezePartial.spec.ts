import { expect, describe, it } from 'vitest'
import { freezePartial } from './freezePartial.js'

describe('freezePartial', () => {
  it('works', () => {
    const obj = {
      question: 42,
      changeme: 'hello'
    }
    freezePartial(obj, {
      changeme: (val) => ['bonjour', 'hello'].includes(val as any)
    })

    expect(obj.question).toBe(42)
    expect(() => {
      obj.question = 4
    }).toThrowError(`You aren't allowed to mutate property \`question\``)
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
    }).toThrowError('Setting wrong value `abc` for property `changeme`')
    obj.changeme = 'bonjour'
    expect(obj.changeme).toBe('bonjour')
  })
})
