/// <reference types="vite/client" />

declare module '*.svg?react' {
  const value: () => React.JSX.Element
  export default value
}
