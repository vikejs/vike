import { FunctionalComponent } from "preact";
import { usePageContext } from "./usePageContext";

export { Link };

const Link: FunctionalComponent<{ href?: string; className?: string }> =
  function (props) {
    const pageContext = usePageContext();
    const className = [
      props.className,
      pageContext.urlPathname === props.href && "is-active",
    ]
      .filter(Boolean)
      .join(" ");
    return <a {...props} className={className} />;
  };
