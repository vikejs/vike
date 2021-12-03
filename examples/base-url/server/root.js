export { root }

// https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-when-using-the-experimental-modules-flag/66651120#66651120
const __dirname = new URL('.', import.meta.url).pathname;

const root = `${__dirname}/..`
