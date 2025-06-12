export { Page }

import { clientOnly } from 'vike-solid/clientOnly'
import { Config } from 'vike-solid/Config'
import image from '../../assets/logo-new.svg'

const ClientOnlyCounter = clientOnly(() => import('./Counter'))
const ClientOnlyCounterSlow = clientOnly(async () => {
  // Wasting time to show the fallback
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return import('./Counter')
})

function Page() {
  return (
    <>
      <Config image={image} />
      <h1>My Vike + Solid App</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>

        <li>
          <ClientOnlyCounter fallback={<>Waiting for client-side only component to load (quick)</>} />
        </li>

        <li>
          <ClientOnlyCounterSlow fallback={<>Waiting for client-side only component to load (slow)</>} />
        </li>
      </ul>
    </>
  )
}
