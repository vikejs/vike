export async function addContextProps({ contextProps: {} }) {

  return {
    msg: 'About'
  }
}

export function setPageProps({ contextProps: { msg } }) {
  return { msg }
}