export async function addContextProps({ contextProps: {} }) {

  return {
    msg: 'Home',
    specialHomeMsg: 'This is data only the homepage uses'
  }
}

export function setPageProps({ contextProps: { msg, specialHomeMsg } }) {
  return { msg, specialHomeMsg }
}