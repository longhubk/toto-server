import { WebSocketTransport } from "@colyseus/ws-transport"
import { RedisPresence, Server } from "colyseus"
require('dotenv').config()
import config from 'config'
import * as express from "express"
import { createServer } from "http"
import { RestFul } from "./restful"
import { Game } from "./sync/game"
import { ROOM_NAME } from "./sync/type"


// create express app
const app = express.default()

app.use(express.static('public'));

app.use(express.json());

const port = parseInt(config.get('serverPort'), 10);

const redisConfig = config.get('redis');
console.log({ redisConfig, port });
const redisPresence = new RedisPresence(redisConfig);


const gameServer = new Server({
  transport: new WebSocketTransport({
    pingInterval: 3000,
    pingMaxRetries: 5,
    server: createServer(app),
  }),
  presence: redisPresence,
})

const game = new Game(redisPresence, gameServer);

game.defineRoom(ROOM_NAME);

(async () => {
  await game.createdRoom();
  const restful = new RestFul(app, game, port);
  restful.bootstrap();
})()

gameServer.listen(port);


console.log(`[GameServer] Listening on Port: ${port}`)