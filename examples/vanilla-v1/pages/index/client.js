hydrateCounters()

function hydrateCounters() {
  document.querySelectorAll('.counter').forEach((counter) => {
    let count = 0
    counter.onclick = () => {
      counter.textContent = `Counter ${++count}`
    }
  })
}
