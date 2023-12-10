export { onValidatePassword }
import { hashSync, verifySync } from '@node-rs/argon2'

const argon2Opts = {
  memory: 3145728,
  iterations: 2,
  parallelism: 64,
  salt_length: 16,
  key_length: 32
}

const correctPassword = 'correct-password'

async function onValidatePassword({ password }) {
  const correctPasswordHashed = hashSync(correctPassword, argon2Opts)
  if (verifySync(correctPasswordHashed, password, argon2Opts)) {
    return { isValid: true }
  }

  return { isValid: false }
}
