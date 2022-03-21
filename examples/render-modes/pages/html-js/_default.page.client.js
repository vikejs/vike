// We can also define `handleCounter()` in `index.page.client.js` instead of `_default.page.client.js`.
// `_default.page.client.js` showcases how to define the browser-side JavaScript of multiple pages.

handleCounter()

function handleCounter() {
  const counterEl = document.querySelector('button')
  let countState = 0
  const txt = () => `Counter ${countState} (Vanilla JS)`
  counterEl.textContent = txt(countState)
  counterEl.onclick = () => {
    countState++
    counterEl.textContent = txt(countState)
  }
}
