import cm from '@classmatejs/react'
import React from 'react'

const FlexGraphicBlocks = () => {
  return (
    <>
      <ExtensionBlock $type="react">vike-react</ExtensionBlock>
      <ExtensionBlock $type="core">vike-core</ExtensionBlock>
      <ExtensionBlock $type="apollo">vike-react-apollo</ExtensionBlock>
      <ExtensionBlock $type="styledjsx">vike-react-styled-jsx</ExtensionBlock>
      <ExtensionBlock $type="redux">vike-react-redux</ExtensionBlock>
      <ExtensionBlock $type="sentry">vike-react-sentry</ExtensionBlock>
    </>
  )
}

export default FlexGraphicBlocks

type blockVariants = 'react' | 'core' | 'apollo' | 'styledjsx' | 'redux' | 'sentry'
const ExtensionBlock = cm.div.variants<{ $type: blockVariants }>({
  base: `
  absolute 
  rounded-lg
  font-mono
  bg-base-200
  border-1 md:border-2 border-base-300
  text-tiny sm:text-sm 
  flex justify-center items-center
`,
  variants: {
    $type: {
      react: `
        top-[22.3%] left-[12%]
        h-[15%] w-[33%]
      `,
      core: `
        top-[60.1%] left-[12%]
        h-[30%] w-[33%]
      `,
      apollo: `
        top-[10%] left-[55.5%]
        h-[11%] w-[35%]
      `,
      styledjsx: `
        top-[30.7%] left-[55.5%]
        h-[11%] w-[35%]
      `,
      redux: `
        top-[52.1%] left-[55.5%]
        h-[11%] w-[35%]
      `,
      sentry: `
        top-[74.4%] left-[55.5%]
        h-[11%] w-[35%]
      `,
    },
  },
})
