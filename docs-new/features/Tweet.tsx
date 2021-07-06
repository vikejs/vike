import React from 'react'

export { Tweet }

function Tweet({ tweetId }: { tweetId: number }) {
  return (
    <blockquote className="twitter-tweet">
      <a href={`https://twitter.com/brillout/status/${tweetId}?ref_src=twsrc%5Etfw`}>Tweet {tweetId}</a>
    </blockquote>
  )
}
