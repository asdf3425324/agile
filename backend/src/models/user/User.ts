import { Ref, prop } from '@typegoose/typegoose'

export class User {
  @prop({ index: true, required: true, lowercase: true, unique: true })
  email: string
  @prop({ required: true, index: true })
  name: string

  @prop({ required: true, index: true, unique: true })
  token: string

  @prop({ required: true })
  boards: string

  // Mongo property
  updatedAt: Date
  _id: string
  _doc: any
  createdAt: Date
}
