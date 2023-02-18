import * as bodyParser from "body-parser"
import * as express from "express"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { Game } from "./sync/game"


export class RestFul {
  private readonly app: express.Express;
  private readonly game: Game;
  private readonly port: number;
  constructor(app: express.Express, game: Game, port: number) {
    this.app = app;
    this.game = game;
    this.port = port;
  }

  bootstrap() {
    const _this = this;

    AppDataSource.initialize().then(async () => {

      _this.app.use(bodyParser.json())

      // register express routes from defined application routes
      Routes.forEach(route => {
        (_this.app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
          const result = (new (route.controller as any)(_this.game))[route.action](req, res, next)
          if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

          } else if (result !== null && result !== undefined) {
            res.json(result)
          }
        })
      })

      console.log(`Express server has started on port 3000. Open http://localhost:${_this.port}/todos to see results`)

    }).catch(error => console.log(error))
  }

}