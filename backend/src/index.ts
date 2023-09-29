import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as cors from '@koa/cors'
import * as Router from 'koa-router'
import * as config from 'config'
import { promises as fs, read } from 'fs'
import * as path from 'path'
import * as serve from 'koa-static'
import * as mount from 'koa-mount'
import {authenticate} from './middlewares/authenticate'
const DATASET = {
  tasks: {
    "task-1": { id: "task-1", content: "Полить цветы" },
    "task-2": { id: "task-2", content: "Купить молоко" },
    "task-3": { id: "task-3", content: "Выполнить госплан" },
    "task-4": { id: "task-4", content: "Выиграть в лотерею" },
    "task-5": { id: "task-5", content: "Слетать на марс" },
  },
  cards: {
    "card-1": {
      id: "card-1",
      title: "Туду",
      taskIds: ["task-1", "task-2"]
    },
    "card-2": {
      id: "card-2",
      title: "В работе",
      taskIds: ["task-3"]
    },
    "card-3": { id: "card-3", title: "Фан", taskIds: ["task-4"] },
    "card-4": { id: "card-4", title: "Готово", taskIds: ["task-5"] }
  },
  cardOrder: ["card-1", "card-2", "card-3", "card-4"]
}

import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose'
import { runMongo } from './models/index'
import {UserModel, getOrCreateUser} from './models/user/index'

// Run mongo
runMongo().then(() => {
  console.log('Mongo connected')
  console.log(UserModel)
})

const app = new Koa()

export async function main() {
  const router = new Router()

  router.post('/update_boards', authenticate, async (ctx, next) => {
    let data = ctx.request.body.DATASET

    const user = await getOrCreateUser(ctx.state.user)
    // let boards = JSON.parse(user.boards)
    user.boards = JSON.stringify(data)
    await user.save()
    ctx.body = {message: 'ok'}
  })

  router.post('/update_board', authenticate, async (ctx, next) => {
    let data = ctx.request.body.DATASET
    const user = await getOrCreateUser(ctx.state.user)
    let boards = JSON.parse(user.boards)
    const index = boards.findIndex(item => item.id === data.id);
    boards[index] = data
    user.boards = JSON.stringify(boards)
    await user.save()
    ctx.body = {
      message: 'ok'
    }
  })
  
  router.post('/get_board', authenticate, async (ctx, next) => {
    const id = ctx.request.body.id_board
    const boards = JSON.parse(ctx.state.user.boards)

    const result = boards.find(item => item.id === id);

    ctx.body = {
      board: result
    }
  })
  
  router.post('/add_board', authenticate, async (ctx, next) => {
    const boards = JSON.parse(ctx.state.user.boards)
    // console.log(boards.length)
    boards.push({id: `${+new Date()}`, title: `Новая доска ${boards.length + 1}`, DATASET: DATASET})
    const user = await getOrCreateUser(ctx.state.user)
    user.boards = JSON.stringify(boards)
    await user.save()
    ctx.body = {
      boards: user.boards
    }
  })

  router.post('/loading_boards', authenticate, async (ctx, next) => {
    let boards = ctx.state.user.boards
    ctx.body = {
      boards
    }
  })

  router.post('/auth', async (ctx, next) => {
    console.log('post auth: ', ctx.request.body)
    const user = await getOrCreateUser(ctx.request.body)
    ctx.body = {
      message: 'ok',
      user
    }
  })

  // Run app
  app.use(cors({ origin: '*' }))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.use(mount('/', serve(path.join(__dirname, '../public'))))

  app.use(async (ctx) => {
    ctx.set('Content-Type', 'text/html')
    ctx.body = await fs.readFile(path.join(__dirname, '../public/index.html'))
  })

  app.listen(config.get('port'))
}

main()