// TODO: Error => unknonw
export let isInvalidConfig: false | Error = false
export const isInvalidConfig_set = (v: false | Error) => {
  isInvalidConfig = v
}
