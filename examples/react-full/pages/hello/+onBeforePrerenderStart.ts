import { names } from './names'

export default function (): string[] {
  return ['/hello', ...names.map((name) => `/hello/${name}`)]
}
