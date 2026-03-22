const tree = {
  type: 'root',
  uri: 'website-project-folder',
  children: [
    {
      type: 'disabled-file',
      uri: '.babelrc',
    },
    {
      type: 'disabled-dir',
      uri: 'node_modules',
    },
    {
      type: 'directory',
      uri: 'hey',
      children: [
        {
          type: 'file',
          uri: '.henlo.tsx',
        },
        {
          type: 'directory',
          uri: 'node_modules2',
        },
      ],
    },
    {
      type: 'directory',
      uri: 'pages',
      children: [
        {
          type: 'file',
          uri: '.henlo2.tsx',
        },
        {
          type: 'directory',
          uri: 'node_modules23',
        },
      ],
    },
  ],
}

const FlexFileTree = () => null

export default FlexFileTree
