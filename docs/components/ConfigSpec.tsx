export { ConfigSpec }
export { IconGlobal }
export { IconLocal }

import React from 'react'
import { assert, Link } from '@brillout/docpress'
import iconGlobal from '../assets/icons/global.svg'
import iconPushpin from '../assets/icons/pushpin.svg'
import iconSparkles from '../assets/icons/sparkles.svg'
import iconLink from '../assets/icons/link.svg'
import iconTypescript from '../assets/icons/typescript.svg'
import { ProvidedBy } from './ProvidedBy'
import './ConfigSpec.css'

/*
Emoji package
https://emojipedia.org/package
https://i.imgur.com/XsdeDvz.png
https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Noto_Emoji_v2.034_1f4e6.svg/40px-Noto_Emoji_v2.034_1f4e6.svg.png
https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Noto_Emoji_v2.034_1f4e6.svg/512px-Noto_Emoji_v2.034_1f4e6.svg.png

Emoji replace
https://www.flaticon.com/free-icon/exchange_17591350
https://i.imgur.com/wnJF8GR.png

Emoji CPU
https://www.freepik.com/icon/processor_2286848
https://i.imgur.com/Ri4a5Ok.png

Emoji stacking rings
https://www.flaticon.com/free-icon/stacking-rings_4593762
https://i.imgur.com/vms3p4B.png

Emoji server
https://i.imgur.com/LOS0NVE.png

Emoji client-server
https://i.imgur.com/9H3OAkk.png
https://i.imgur.com/rsJYPaa.png
https://i.imgur.com/nkHZhEo.png
https://i.imgur.com/yYDvhGa.png
*/

function ConfigSpec({
  env,
  cumulative,
  global,
  providedBy,
  requires,
  type,
  children,
  ...prop
}: {
  env: React.ReactNode
  cumulative?: true
  global?: true | false
  providedBy?: React.ReactNode
  default?: React.ReactNode
  requires?: React.ReactNode
  type?: React.ReactNode
  children?: React.ReactNode
}) {
  assert(type === undefined)
  return (
    <div
      style={{
        backgroundColor: '#efefef',
        border: '1px solid #dee2e6',
        borderRadius: 8,
        paddingLeft: 14,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 2,
        marginBottom: 24,
      }}
    >
      {!env ? null : (
        <>
          <img
            src="https://i.imgur.com/Ri4a5Ok.png"
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4 }}
          />{' '}
          Environment: {env}
          <br />
        </>
      )}
      {!children ? null : (
        <>
          <img
            src={iconTypescript}
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4, verticalAlign: 'top' }}
          />{' '}
          <div className="code-padding-buster" style={{ display: 'inline-block' }}>
            {children}
          </div>
          <br />
        </>
      )}
      {!prop.default ? null : (
        <>
          <img src={iconSparkles} width="20" style={{ display: 'inline-block', position: 'relative', top: 4 }} />{' '}
          Default: {prop.default}
          <br />
        </>
      )}
      {!requires ? null : (
        <>
          <img src={iconLink} width="20" style={{ display: 'inline-block', position: 'relative', top: 4 }} /> Requires:{' '}
          {requires}
          <br />
        </>
      )}
      {global === null ? null : global ? (
        <>
          <IconGlobal /> <Link href="/config#global">Global</Link>
          <br />
        </>
      ) : (
        <>
          <IconLocal /> <Link href="/config#global">Local</Link>
          <br />
        </>
      )}
      {cumulative === undefined ? null : cumulative ? (
        <>
          <img
            src="https://i.imgur.com/vms3p4B.png"
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4 }}
          />{' '}
          <Link href="/config#cumulative">Cumulative</Link>
          <br />
        </>
      ) : (
        <>
          <img
            src="https://i.imgur.com/wnJF8GR.png"
            width="20"
            style={{ display: 'inline-block', position: 'relative', top: 4 }}
          />{' '}
          <Link href="/config#cumulative">Non-cumulative</Link>
          <br />
        </>
      )}
      {providedBy ?? <ProvidedBy core />}
    </div>
  )
}

function IconGlobal() {
  return <img src={iconGlobal} width="20" style={{ display: 'inline-block', position: 'relative', top: 4 }} />
}
function IconLocal() {
  return (
    <img
      src={iconPushpin}
      width="19"
      style={{ display: 'inline-block', position: 'relative', top: 5, marginRight: 1 }}
    />
  )
}
