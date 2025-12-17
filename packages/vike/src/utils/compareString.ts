export { compareString }

function compareString(str1: string, str2: string): number {
  if (str1.toLowerCase() < str2.toLowerCase()) return -1
  if (str1.toLowerCase() > str2.toLowerCase()) return 1
  return 0
}
