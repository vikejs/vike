// TODO: Error => unknonw
export let isInvalidConfig: false | Error = false
//export let invalidConfigErr: unknown
export const isInvalidConfig_set = (v: false | Error) => {
  isInvalidConfig = v
}
