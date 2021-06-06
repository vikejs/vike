declare module "*.svg" {
  const value: string;
  export default value;
}
declare module "*.mdx" {
  import { FunctionComponent } from "react";
  const value: FunctionComponent;
  export default value;
}
