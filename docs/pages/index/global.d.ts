/// <reference types="vite/client" />

// vite-plugin-svgr
declare module '*.svg?react' {
  const value: () => React.JSX.Element
  export default value
}
