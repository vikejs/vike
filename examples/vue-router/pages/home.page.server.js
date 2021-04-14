export async function addContextProps({ contextProps: {} }) {

  return {
    msg: 'Home'
  }
}

export function setPageProps({ contextProps: { msg } }) {
  return { msg }
}