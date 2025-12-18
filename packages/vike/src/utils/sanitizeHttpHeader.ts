// Sanitize HTTP header values to prevent HTTP Response Splitting attacks
// Based on: https://stackoverflow.com/questions/26345349/how-can-i-prevent-http-response-splitting-in-node-js/26346150#26346150
// See also: https://owasp.org/www-community/attacks/HTTP_Response_Splitting
export function sanitizeHttpHeader(value: string): string {
  // Remove CR (\r) and LF (\n) characters to prevent header injection
  return value.replace(/[\r\n]/g, '')
}
