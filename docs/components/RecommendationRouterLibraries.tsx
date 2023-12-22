export { RecommendationRouterLibraries }

import React from 'react'
import { Link, Warning } from '@brillout/docpress'

function RecommendationRouterLibraries({ libraryName, githubRepo }: { libraryName: string; githubRepo: string }) {
  const onBeforeRouteLink = (
    <Link href="/onBeforeRoute">
      <code>onBeforeRoute()</code>
    </Link>
  )
  return (
    <>
      <Warning>
        <p>
          While it's possible to use {libraryName} we recommend against it: Vike's built-in router has many features
          that {libraryName} doesn't (and cannot) offer.
        </p>
        <p>
          That said, if you have an existing app using {libraryName} that you want to migrate to Vike, then it makes
          sense to start using Vike with {libraryName} and, after your migration is done, to progressively migrate from{' '}
          {libraryName} to Vike's router.
        </p>
        <p>
          Create a new feature request if you want a feature provided by {libraryName} that Vike's router is missing.
        </p>
      </Warning>
      <blockquote>
        <p>
          We believe that the frontend routing should be completely owned by the frontend framework. Trying to seperate
          concerns in that regard leads to a frankenstein architecture.
        </p>
      </blockquote>
      <p>
        Example of using Vike with {libraryName} (shallow integration without using {onBeforeRouteLink}):
      </p>
      <ul>
        <li>
          <a href={'https://github.com/' + githubRepo}>
            GitHub &gt; <code>{githubRepo}</code>
          </a>
        </li>
      </ul>
      <p>Contribution welcome to explore deep integration using {onBeforeRouteLink}.</p>
    </>
  )
}
