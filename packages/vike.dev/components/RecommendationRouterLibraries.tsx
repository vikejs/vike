export { RecommendationRouterLibraries }

import React from 'react'
import { Link, Warning } from '@brillout/docpress'

function RecommendationRouterLibraries({
  libraryName,
  githubRepo,
  link,
}: { libraryName: string; githubRepo: string; link: string }) {
  const onBeforeRouteLink = (
    <Link href="/onBeforeRoute">
      <code>onBeforeRoute()</code>
    </Link>
  )
  return (
    <>
      <Warning>
        <p>
          While it's possible to use Vike with <a href={link}>{libraryName}</a> we recommend against it: Vike's built-in
          router has features that {libraryName} doesn't offer.
        </p>
        <p>
          That said, if you have an existing app using {libraryName} that you want to migrate to Vike, then it can makes
          sense to start using Vike with {libraryName}. After your migration is done you can later/progressively migrate
          from {libraryName} to Vike's built-in router.
        </p>
        <p>
          Vike's router aims to be as feature-rich as {libraryName}: if you need a {libraryName} feature that is missing
          then create a new feature request.
        </p>
      </Warning>
      <blockquote>
        <p>
          We believe routing should be completely owned by the frontend framework. Trying to separate concerns in that
          regard leads to inherent DX degradations.
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
      <p>Contributions welcome to explore deep integration using {onBeforeRouteLink}.</p>
    </>
  )
}
