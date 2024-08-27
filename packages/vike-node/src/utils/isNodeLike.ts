import { import_ } from './import_.js'

export async function isNodeLike() {
  try {
    await import_('node:http')
    return true
  } catch {
    return false
  }
}
