import * as jwt from 'jsonwebtoken'
import * as config from 'config'

config.get('jwt')

export function sign<T extends Record<string, unknown>>(
  payload: T
): Promise<string> {
  return new Promise((res, rej) => {
    jwt.sign(payload, config.get('jwt'), undefined, (err, token) => {
      return err ? rej(err) : res(token)
    })
  })
}

export function verify(token: string) {
  return new Promise((res, rej) => {
    jwt.verify(token, config.get('jwt'), undefined, (err, payload) => {
      return err ? rej(err) : res(payload)
    })
  })
}