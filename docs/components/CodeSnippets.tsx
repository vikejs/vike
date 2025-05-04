export { CodeSnippets }

import React, { useMemo, useState } from 'react'

const frontendFrameworks = ['React', 'Solid', 'Vue']
const backendFrameworks = ['Express.js', 'Hono', 'Fastify', 'h3', 'Elysia']
const frameworks = {
  frontend: frontendFrameworks,
  backend: backendFrameworks
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

type ChildProps = React.PropsWithChildren &
  DeepPartial<HTMLDivElement> & {
    lang: string
    framework?: string
    ext?: string
    children: React.ReactNode
  }

function CodeSnippets({
  children,
  filePath,
  framework
}: {
  children: React.ReactNode
  filePath: string
  framework?: 'frontend' | 'backend'
}) {
  // TODO: set & get states from localStorage ?
  const [selectedFramework, setSelectedFramework] = useState(framework ? frameworks[`${framework}`][0] : undefined)
  const [selectedLang, setSelectedLang] = useState('js')
  const ext = useMemo(() => {
    if (selectedFramework === 'Vue') return 'vue'
    if (framework === 'frontend') return `${selectedLang}x`
    return selectedLang
  }, [selectedFramework, selectedLang])

  const selectedId = useMemo(
    () => `${framework ? `${selectedFramework}-` : ''}${filePath}-${selectedLang}`,
    [framework, selectedFramework, selectedLang, filePath]
  )

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === 'framework') {
      setSelectedFramework(e.target.value)
    }
    if (e.target.name === 'lang') {
      setSelectedLang(e.target.value)
    }
  }

  const copyToClipboard = () => {
    const selectedDiv = document.getElementById(selectedId)
    navigator.clipboard.writeText(selectedDiv?.textContent ?? '')
  }

  const clonedChildren = React.Children.toArray(children).map((children, index) => {
    if (React.isValidElement<ChildProps>(children)) {
      const selected =
        children.props.lang === selectedLang &&
        (children.props.framework === selectedFramework || !children.props.framework)
      const id = `${framework ? `${children.props.framework}-` : ''}${filePath}-${children.props.lang}`
      return React.cloneElement(children, {
        id,
        style: { display: !selected ? 'none' : 'block' }
      })
    }
    return null
  })

  return (
    <>
      <div style={{ display: 'flex', margin: '0.25rem 1rem' }}>
        <span style={{ flexGrow: 1 }}>
          {filePath}.{ext}
        </span>
        <form style={{ display: 'flex', columnGap: '5px' }}>
          {framework && (
            <select name="framework" id="framework" onChange={handleChange}>
              {frameworks[`${framework}`].map((framework, index) => (
                <option key={index} defaultValue={selectedFramework} value={framework}>
                  {framework}
                </option>
              ))}
            </select>
          )}
          <select name="lang" id="lang" onChange={handleChange}>
            <option value="js">Javascript</option>
            <option value="ts">Typescript</option>
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
