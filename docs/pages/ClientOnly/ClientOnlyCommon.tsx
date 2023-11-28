import React from 'react'
import Example from './Example.mdx'
import ReactUsage from './ReactUsage.mdx'
import SolidUsage from './SolidUsage.mdx'

export const ClientOnlyCommon = ({
  packageName,
  hasDepsArgument
}: {
  packageName: string
  hasDepsArgument: boolean
}) => {
  return (
    <div>
      <h3>Usage</h3>
      {packageName === 'vike-react' && <ReactUsage />}
      {packageName === 'vike-solid' && <SolidUsage />}
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
        {hasDepsArgument && (
          <li>
            <strong>deps</strong> (optional): An array of dependencies that, when changed, will trigger a reload of the
            dynamic component.
          </li>
        )}
      </ul>

      {hasDepsArgument && (
        <>
          <h3>Example</h3>
          <Example />
        </>
      )}
    </div>
  )
}
