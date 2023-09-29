import { DocumentType, getModelForClass } from '@typegoose/typegoose'
import { User } from './User'
import { sign } from '../../helpers/jwt'
import boards from './data-board'

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

interface LoginOptions {
  email: string
  name: string
  todo?: any
  token?: any
}

export async function getOrCreateUser(loginOptions: LoginOptions) {
  if (!loginOptions.name) {
    throw new Error()
  }
  if (!loginOptions.email) {
    throw new Error()
  }
  let user: DocumentType<User> | undefined
  user = await UserModel.findOne({ email: loginOptions.email })
  if (!user) {
    if (!(loginOptions.email || loginOptions.name)) {
      throw new Error()
    }
    const params = {
      name: loginOptions.name,
      email: loginOptions.email
    } as any
    user = (await new UserModel({
      ...params,
      boards: JSON.stringify(boards),
      token: await sign(params)
    }).save()) as DocumentType<User>
  }
  return user
}