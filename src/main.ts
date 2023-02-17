import * as bodyParser from "body-parser"
const port = parseInt(process.env.PORT, 10) || 3000
import { Server } from "colyseus"
import * as express from "express"
import { Request, Response } from "express"
import { createServer } from "http"
import { AppDataSource } from "./data-source"
import { Todo } from "./entities/todo.entity"
import { Routes } from "./routes"

// create express app
const app = express.default()

AppDataSource.initialize().then(async () => {

  app.use(bodyParser.json())

  // register express routes from defined application routes
  Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
      const result = (new (route.controller as any))[route.action](req, res, next)
      if (result instanceof Promise) {
        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

      } else if (result !== null && result !== undefined) {
        res.json(result)
      }
    })
  })

  // insert new todos for test
  await AppDataSource.manager.save(
    AppDataSource.manager.create(Todo, {
      title: "task1",
      description: "Eat",
      completed: true
    })
  )

  await AppDataSource.manager.save(
    AppDataSource.manager.create(Todo, {
      title: "task2",
      description: "Sleep",
      completed: false
    })
  )

  console.log(`Express server has started on port 3000. Open http://localhost:${port}/todos to see results`)

}).catch(error => console.log(error))

app.use(express.json());

const gameServer = new Server({
  server: createServer(app)
});

gameServer.listen(port)

console.log(`[GameServer] Listening on Port: ${port}`)