export { setPageProps };
export { prerender };

type ContextProps = {
  name: string;
};

function setPageProps({ contextProps }: { contextProps: ContextProps }) {
  const { name } = contextProps;
  return { name };
}

function prerender() {
  const names = ["evan", "rom", "alice", "jon", "eli"];
  const urls = names.map((name) => `/hello/${name}`);
  return urls;
}
