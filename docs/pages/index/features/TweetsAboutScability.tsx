import React from 'react'

export { TweetsAboutScability }

function TweetsAboutScability() {
  const tweetStyle = {
    width: `min(100%, 400px, max(300px, 50% - 10px))`,
    display: 'inline-block',
    verticalAlign: 'top',
    overflow: 'hidden'
  }
  return (
    <>
      <div style={{ textAlign: 'center', fontSize: '0.9em', color: '#888', marginTop: 30 }}>
        Large production apps are using Vite for its dev speed.
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', maxWidth: 900 }}>
        <div style={tweetStyle}>
          <Tweet tweetId={'1398240747661533184'} />
        </div>
        <div style={tweetStyle}>
          <Tweet tweetId={'1392901819135795202'} />
        </div>
      </div>
    </>
  )
}

function Tweet({ tweetId }: { tweetId: string }) {
  return (
    <blockquote className="twitter-tweet">
      <a href={`https://twitter.com/brillout/status/${tweetId}?ref_src=twsrc%5Etfw`}>Tweet {tweetId}</a>
    </blockquote>
  )
}
