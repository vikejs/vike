import React from 'react'

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
      <pre>
        <code>
          {`import { ClientOnly } from '${packageName}/ClientOnly'
  function MyComponent(props) {
    return (
      <ClientOnly load={() => import('path-to-dynamic-component')} fallback={<Loading />}>
        {Component => <Component {...props} />}
      </ClientOnly>
    );
  }`}
        </code>
      </pre>

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
          <pre>
            <code>
              {`function MapContainer(props) {
  const { geoLocation } = props;

  return (
    <ClientOnly
      load={() => import('heavy-map-library')}
      fallback={<Loading />}
      deps={[geoLocation]}
    >
      {Map => <Map geoLocation={geoLocation} />}
    </ClientOnly>
  );
}`}
            </code>
          </pre>
        </>
      )}
    </div>
  )
}
