import React from 'react'

export { Tweet }

function Tweet({ tweetId }: { tweetId: number }) {
  return (
    /*
    <blockquote className="twitter-tweet"><p lang="en" dir="ltr">Result: 10x faster HMR <a href="https://t.co/mEyGH0VHQP">https://t.co/mEyGH0VHQP</a></p>&mdash; Rom Brillout (@brillout) <a href="https://twitter.com/brillout/status/1398240747661533184?ref_src=twsrc%5Etfw">May 28, 2021</a></blockquote>
    /*/
    <blockquote className="twitter-tweet">
      <a href={`https://twitter.com/brillout/status/${tweetId}?ref_src=twsrc%5Etfw`}>Tweet {tweetId}</a>
    </blockquote>
    //*/
  )
}
