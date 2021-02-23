export { setPageProps }

function setPageProps({ contextProps }: { contextProps: { url: string } }) {
  const { url } = contextProps
  return { url }
}
