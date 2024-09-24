import type { Config } from 'vike/types'

export default {
  // Test: use import string instead of +Page file.
  // @ts-ignore I ain't sure whether import strings should be part of the official type. Probably so.
  Page: 'import:./Page.jsx'
} satisfies Config
