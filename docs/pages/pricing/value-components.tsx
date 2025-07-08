export { Separator }
export { TableRef }
export { ValueTable }

import React, { ReactNode } from 'react'
import { assert } from '@brillout/docpress'

const COLOR_RED = '#a00'
const COLOR_GREEN = '#0a0'
const COLOR_ORANGE = '#e90'

function Separator() {
  return <>&nbsp;&#124;</>
}

function Yes() {
  return <span style={{ color: COLOR_GREEN, fontSize: '1.9em', display: 'block' }}>&#x2713;</span>
}
function No() {
  return <span style={{ color: COLOR_RED, fontSize: '1.6em', display: 'block' }}>&#x2717;</span>
}

function Gauge({ value }: { value: number }) {
  const borderRadius = 10
  const width = compute_width()
  const color = compute_color(value)
  return (
    <div
      className="value-gauge"
      style={{
        height: 9,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ddd',
        borderRadius,
        display: 'flex',
        padding: '1px 2px',
      }}
    >
      <div
        style={{
          height: '100%',
          width,
          backgroundColor: color,
          borderRadius,
        }}
      />
    </div>
  )

  function compute_width() {
    assert(value > 0 && value < 100)
    return 'calc(' + value / 100 + ' * 100%)'
  }
}

function compute_color(value: number) {
  assert(value > 0 && value < 100)
  if (value < 50) {
    return COLOR_RED
  }
  if (value >= 75) {
    return COLOR_GREEN
  }
  return COLOR_ORANGE
}

function TableRef({ name, children }: { name: string; children: React.JSX.Element[] }) {
  return (
    <>
      <em>{name}</em>: {children}
    </>
  )
}

type FinancialModel = {
  modelName: string
  transparent: number
  forkable: number
  accessible: number
  independent: number
  sustainable: number
}
function ValueTable({
  entries,
  skip_links,
}: {
  entries: FinancialModel[]
  skip_links: boolean
}) {
  return (
    <div className="values-table">
      <table>
        <thead>
          <tr>
            <TH>{''}</TH>
            <TH>Trans&shy;parent</TH>
            <TH>Fork&shy;able</TH>
            <TH>Access&shy;ible</TH>
            <TH>Sustai&shy;nable</TH>
            <TH>Inde&shy;pendent</TH>
          </tr>
        </thead>
        <tbody>
          {entries.map((props, i) => (
            <TrEntry key={i} {...props} />
          ))}
        </tbody>
      </table>
    </div>
  )

  function TrEntry({ modelName, transparent, forkable, accessible, independent, sustainable }: FinancialModel) {
    return (
      <tr>
        <TD>{modelName}</TD>
        <TD>
          <Value val={transparent} />
        </TD>
        <TD>
          <Value val={forkable} />
        </TD>
        <TD>
          <Value val={accessible} />
        </TD>
        <TD>
          <Value val={sustainable} />
        </TD>
        <TD>
          <Value val={independent} />
        </TD>
      </tr>
    )
  }

  function TH({ children, ...rest }: { children: string; rest?: never }) {
    assert(Object.keys(rest).length === 0)
    if (!children) return <th />
    const value_name = children
    const child = skip_links ? value_name : <a href={get_value_link(value_name)}>{value_name}</a>
    return <th align="center">{child}</th>
  }

  function get_value_link(value_name: string) {
    assert(value_name.constructor === String)
    assert(!value_name.includes('&shy;'), { value_name })
    assert(!value_name.includes('%C2%AD'), { value_name })
    /*
    const value_link =
      "/values#" + value_name.toLowerCase().replace(/[^a-z]/gi, "");
    /*/
    const value_link = '/values'
    //*/
    return value_link
  }

  function TD({ children }: { children: ReactNode }) {
    return <td align="center">{children}</td>
  }

  function Value({ val }: { val: number }) {
    assert(0 <= val && val <= 1)
    if (val === 1) {
      return <Yes />
    }
    if (val === 0) {
      return <No />
    }
    return <Gauge value={val * 100} />
  }
}
