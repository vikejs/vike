import React from 'react'
import ReactUsage from './ReactUsage.mdx'
import SolidUsage from './SolidUsage.mdx'

export const ClientOnlyCommon = ({
  packageName,
}: {
  packageName: string
}) => {
  const isReact = packageName === 'vike-react'
  const isSolid = packageName === 'vike-solid'
  return (
    <div>
      <h3>Usage</h3>
      {isReact && <ReactUsage />}
      {isSolid && <SolidUsage />}
      <h3>Props</h3>
      <ul>
        <li>
          <strong>load</strong>: A function that returns a promise resolving to import the specified component's path,
          dynamically loading it.
        </li>
        <li>
          <strong>children</strong>: A function that takes the loaded component and returns the JSX to be rendered.
        </li>
        <li>
          <strong>fallback</strong>: A JSX element that is displayed while the dynamic component is being loaded.
        </li>
        {isReact && (
          <li>
            <strong>deps</strong> (optional): An array of dependencies that, when changed, will trigger a re-render of the
            dynamic component. The <code>deps</code> prop of <code>{'<ClientOnly>'}</code> is passed as-is to the <a href="https://react.dev/reference/react/useEffect#parameters"><code>dependencies</code> parameter</a> of React's <a href="https://react.dev/reference/react/useEffect">useEffect() hook</a>.
          </li>
        )}
      </ul>
    </div>
  )
}
