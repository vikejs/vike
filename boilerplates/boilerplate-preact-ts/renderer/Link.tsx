import { usePageContext } from "./usePageContext";

export { Link };

function Link(props: { href?: string; className?: string; children: JSX.Element[] | JSX.Element | string; }) {
  const pageContext = usePageContext();
  const className = [props.className, pageContext.urlPathname === props.href && "is-active"]
    .filter(Boolean)
    .join(" ");
  return <a {...props} className={className} />;
}
