declare module '*.mdx' {
  import { FunctionComponent } from 'react'
  const value: FunctionComponent
  export default value
  export const headings: { level: number; title: string; id: string; titleAddendum?: string }[]
}
