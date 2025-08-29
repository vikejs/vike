export { ConfigSpec }

import React from 'react'
import { Link } from '@brillout/docpress'
import iconGlobal from '../assets/icons/global.svg'
import iconPage from '../assets/icons/page.svg'
import iconSparkles from '../assets/icons/sparkles.svg'
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
  type,
  children,
  ...prop
}: {
  env: React.ReactNode
  cumulative?: true
  global?: true
  providedBy?: React.ReactNode
  default?: React.ReactNode
  type?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <>
      <>
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
        {!type && !children ? null : (
          <>
            <img
              src={iconTypescript}
              width="20"
              style={{ display: 'inline-block', position: 'relative', top: 4, verticalAlign: 'top' }}
            />{' '}
            {children ? (
              <div className="code-padding-buster" style={{ display: 'inline-block' }}>
                {children}
              </div>
            ) : (
              type
            )}
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
        {global ? (
          <>
            <img src={iconGlobal} width="20" style={{ display: 'inline-block', position: 'relative', top: 4 }} />{' '}
            <Link href="/config#global">Global</Link>
            <br />
          </>
        ) : (
          <>
            <img src={iconPage} width="20" style={{ display: 'inline-block', position: 'relative', top: 5 }} />{' '}
            <Link href="/config#global">Local</Link>
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
      </>
      {providedBy ?? <ProvidedBy core />}
    </>
  )
}
