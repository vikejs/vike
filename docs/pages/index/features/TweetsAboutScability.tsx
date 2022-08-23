import React from 'react'

export { TweetsAboutScability }

function TweetsAboutScability() {
  return (
    <>
      <div style={{ textAlign: 'center', fontSize: '0.9em', color: '#888', marginTop: 30 }}>
        Large production apps are using Vite for its speed.
      </div>
      <TweetRow tweetId1={'1398240747661533184'} tweetId2={'1392901819135795202'} />
      <TweetRow tweetId1={'1409983946201370626'} tweetId2={'1423324336845426691'} />
    </>
  )
}

function TweetRow({ tweetId1, tweetId2 }: { tweetId1: string; tweetId2: string }) {
  const tweetStyle = {
    width: `min(100%, 400px, max(300px, 50% - 10px))`,
    display: 'inline-block',
    verticalAlign: 'top',
    overflow: 'hidden'
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', maxWidth: 900 }}>
      <div style={tweetStyle}>
        <Tweet tweetId={tweetId1} />
      </div>
      <div style={tweetStyle}>
        <Tweet tweetId={tweetId2} />
      </div>
    </div>
  )
}

function Tweet({ tweetId }: { tweetId: string }) {
  return (
    <blockquote className="twitter-tweet">
      <a href={`https://twitter.com/brillout/status/${tweetId}?ref_src=twsrc%5Etfw`}>Tweet {tweetId}</a>
    </blockquote>
  )
}
