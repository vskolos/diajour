import crypto from 'crypto'

export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/

export function hashPassword(password: string) {
  if (!process.env.SALT) throw new Error('Add SALT .env variable to proceed')

  return crypto
    .pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512')
    .toString('hex')
}
