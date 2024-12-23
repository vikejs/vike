/// <reference types="vite/client" />

declare module '*.svg?react' {
  const value: () => JSX.Element
  export default value
}
