import { sleep } from '../../renderer/utils'
// The navigation is superseded while this hook is pending: the page is never rendered
export async function onData() {
  await sleep(5000)
}
