export { getPageTitle }

function getPageTitle(pageContext) {
  const title =
    // Convention: if +data returns a title property then use it to set the value of the meta tag <title>
    pageContext.data?.title ||
    // Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js)
    // The setting 'pageContext.config.title' is a custom setting we defined at ./+config.ts
    pageContext.config.title ||
    'Vike Demo'
  return title
}
