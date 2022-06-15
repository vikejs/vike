export { Layout }

import './Layout.css'
import { LayoutDefault } from '../../renderer/LayoutDefault'

function Layout({ children }) {
  return (
    <>
      <LayoutDefault>
        <h1>Starship 🚀</h1>
        <p>
          <b>
            This page uses the default layout <code>/renderer/LayouDefault.jsx</code>.
            <br />
            With the nested layout <code>/pages/starship/Layout.jsx</code>.
          </b>
        </p>
        <div className="sub-navigation">
          <a href="/starship/">Overview</a> <a href="/starship/reviews">Reviews</a>{' '}
          <a href="/starship/spec">Tech Spec</a>
        </div>
        <div style={{ marginTop: 20 }}>{children}</div>
      </LayoutDefault>
    </>
  )
}
