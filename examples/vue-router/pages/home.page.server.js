export async function addContextProps({ contextProps: {} }) {

  return {
    msg: 'Home',
    specialHomeMsg: 'This is data only the homepage uses'
  }
}

export const passToClient = ['specialHomeMsg', 'msg']