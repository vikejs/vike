declare module "*.svg" {
  const value: string;
  export default value;
}
declare module "*.mdx" {
  import { FunctionComponent } from "react";
  const value: FunctionComponent;
  export default value;
  export const headings: {level: number, title: string}[]
}
declare module "Docs.mdx" {
  import { FunctionComponent } from "react";
  const value: FunctionComponent;
  export default value;
  export const headings: {level: number, title: string}[]
}
