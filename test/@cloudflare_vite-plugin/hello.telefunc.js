export { hello }

import { shield } from 'telefunc'
const t = shield.type

const hello = shield([{ name: t.string }], async function ({ name }) {
  const message = `Welcome ${name}`
  return { message }
})
