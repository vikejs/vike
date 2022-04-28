export { capitalizeFirstLetter }

function capitalizeFirstLetter(word: string): string {
  if (!word[0]) {
    return word
  }
  return word[0].toUpperCase() + word.slice(1)
}
