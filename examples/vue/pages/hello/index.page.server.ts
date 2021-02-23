export { setPageProps };

type ContextProps = {
  name: string;
};

function setPageProps({ contextProps }: { contextProps: ContextProps }) {
  const { name } = contextProps;
  return { name };
}
