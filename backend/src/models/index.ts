import * as mongoose from 'mongoose'
import * as config from 'config'

export function runMongo() {
  return mongoose.connect(config.get('MONGO'))
}
export function stopMongo() {
  return mongoose.disconnect()
}
