import React from 'react'
import ReactUsage from './ReactUsage.mdx'
import SolidUsage from './SolidUsage.mdx'
import VueUsage from './VueUsage.mdx'

export const ClientOnlyCommon = ({ packageName }: { packageName: string }) => {
  const isReact = packageName === 'vike-react'
  const isSolid = packageName === 'vike-solid'
  const isVue = packageName === 'vike-vue'

  return (
    <div>
      <h3>Usage</h3>
      {isReact && <ReactUsage />}
      {isSolid && <SolidUsage />}
      {isVue && <VueUsage />}
      <h3>Props</h3>
      {isVue && (
        <blockquote>
          <p>
            All props are passed to the loaded component (except <code>load</code>). Type inference doesn't work as of
            now, see <a href="https://github.com/vikejs/vike-vue/issues/67">vike-vue#67</a>.
          </p>
        </blockquote>
      )}
      <ul>
        <li>
          <strong>load</strong>: The function that imports the component.
        </li>
        {!isVue && (
          <>
            <li>
              <strong>children</strong>: The function that renders the component.
            </li>
            <li>
              <strong>fallback</strong>: The element that is displayed while the component is being loaded.
            </li>
          </>
        )}
        {isReact && (
          <li>
            <strong>deps</strong> (optional): An array of dependencies that, when changed, triggers a re-render of the
            component. The <code>deps</code> prop of <code>{'<ClientOnly>'}</code> is passed as-is to the{' '}
            <a href="https://react.dev/reference/react/useEffect#parameters">
              <code>dependencies</code> parameter
            </a>{' '}
            of React's <a href="https://react.dev/reference/react/useEffect">useEffect() hook</a>.
          </li>
        )}
      </ul>
    </div>
  )
}
