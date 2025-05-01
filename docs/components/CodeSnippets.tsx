export { CodeSnippets }

import React, { useMemo, useState } from 'react'

const frontendFrameworks = ['React', 'Solid', 'Vue']
const backendFrameworks = ['Express.js', 'Hono', 'Fastify', 'h3', 'Elysia']
const frameworks = {
  frontend: frontendFrameworks,
  backend: backendFrameworks
}

interface ChildProps extends React.PropsWithChildren {
  lang: string
  framework?: string
  ext?: string
  style?: Partial<HTMLElement['style']>
  children: string | React.ReactNode
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

  const handleFrameworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFramework(e.target.value)
  }

  const filteredChildren = React.Children.toArray(children).map((child) => {
    if (React.isValidElement<ChildProps>(child)) {
      return React.cloneElement(child, {
        style: {
          display:
            child.props.lang === selectedLang && (child.props.framework === selectedFramework || !child.props.framework)
              ? 'block'
              : 'none'
        }
      })
    }
    return null
  })

  return (
    <div>
      <div style={{ display: 'flex', margin: '0.25rem 1rem' }}>
        <span style={{ flexGrow: 1 }}>
          {filePath}.{ext}
        </span>
        <div style={{ display: 'flex', columnGap: '5px' }}>
          {framework && (
            <select name="framework" id="framework" onChange={handleFrameworkChange}>
              {frameworks[`${framework}`].map((framework, index) => (
                <option key={index} defaultValue={selectedFramework} value={framework}>
                  {framework}
                </option>
              ))}
            </select>
          )}
          <select name="lang" id="lang" onChange={(e) => setSelectedLang(e.target.value)}>
            <option value="js">Javascript</option>
            <option value="ts">Typescript</option>
          </select>
        </div>
      </div>
      <div>{filteredChildren}</div>
    </div>
  )
}
