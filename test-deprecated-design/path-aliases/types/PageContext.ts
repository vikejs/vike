import type { JSX } from 'react'

export type ReactComponent = () => JSX.Element
export type PageContext = {
  Page: ReactComponent
}
