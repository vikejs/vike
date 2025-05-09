import React, { useState } from 'react'

export const CodeVariantsServer = createCodeVariants('server', ['Express.js', 'Hono', 'Fastify', 'h3', 'Elysia'])
export const CodeVariantsJsxOrVue = createCodeVariants('jsx-or-vue', ['JSX', 'Vue'])

function createCodeVariants(
  storageKey: string, // for localStorage
  choices: string[] // validation
) {
  return function CodeVariants({ children, filePath }: { children: React.ReactNode; filePath: string }) {
    const [selectedChoice, setSelectedChoice] = useState(choices[0])

    const copyToClipboard = () => {
      const selectedCodeVariant = document.getElementById(`${selectedChoice.toLocaleLowerCase()}-code`)
      navigator.clipboard.writeText(selectedCodeVariant?.textContent ?? '')
    }

    const clonedChildren = React.Children.toArray(children).map((child, index) => {
      if (React.isValidElement<CodeVariantProps>(child)) {
        const selected = selectedChoice === child.props.framework
        const props = {
          _id: `${child.props.framework.toLocaleLowerCase()}-code`,
          _selected: selected
        }
        return React.cloneElement(child, props)
      }
      return null
    })

    return (
      <>
        <div style={{ display: 'flex', margin: '0.25rem 1rem' }}>
          <span style={{ flexGrow: 1 }}>{filePath}</span>
          <form style={{ display: 'flex', columnGap: '5px' }}>
            <select name="choice" id="choice" onChange={(e) => setSelectedChoice(e.target.value)}>
              {choices.map((choice, index) => (
                <option key={index} defaultValue={selectedChoice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </form>
        </div>
        <div>
          <button onClick={copyToClipboard}>Copy</button>
          {clonedChildren}
        </div>
      </>
    )
  }
}

type CodeVariantProps = {
  children: React.ReactNode
  framework: string
  _id?: string
  _selected?: boolean
}

export function CodeVariant(props: CodeVariantProps) {
  const { _id, _selected, children } = props

  return (
    <div id={_id} style={{ display: !_selected ? 'none' : 'block' }}>
      {children}
    </div>
  )
}
