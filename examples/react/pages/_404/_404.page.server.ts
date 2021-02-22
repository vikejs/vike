export { setPageProps };

type ContextProps = {
  url: string;
};

function setPageProps({ contextProps }: { contextProps: ContextProps }) {
  const { url } = contextProps;
  return { url };
}
