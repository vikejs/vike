export let isConfigInvalid = false
export let wasConfigEverValid: null | boolean = null
export const isConfigInvalid_set = (val: boolean) => {
  isConfigInvalid = val
  if (val) wasConfigEverValid = true
  if (wasConfigEverValid === null) {
    wasConfigEverValid = val
  }
}
