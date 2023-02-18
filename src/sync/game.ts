import { matchMaker, RedisPresence, RoomListingData, Server } from "colyseus";
import { getLogger, Logger } from "../../utils/logger";
import { MyRoom } from "./room";
import { TodoData } from "./schema";
import { CREATE_TODO, DELETE_TODO, ROOM_NAME, UPDATE_TODO } from "./type";

export class Game {
  public x: number = 1;
  public room: MyRoom;
  private readonly redisPresence: RedisPresence;
  private readonly gameServer: Server;
  private readonly logger: Logger = getLogger(Game.name);
  constructor(redisPresence: RedisPresence, gameServer: Server) {
    this.redisPresence = redisPresence;
    this.gameServer = gameServer;

    // this.redisPresence.subscribe(CREATE_TODO, (data: TodoData) => {
    //   this.room.onCreateTodo(data)
    // })

    // this.redisPresence.subscribe(UPDATE_TODO, (data: TodoData) => {
    //   this.room.onUpdateTodo(data)
    // })

    // this.redisPresence.subscribe(DELETE_TODO, (data: TodoData) => {
    //   this.room.onDeleteTodo(data)
    // })
  }

  defineRoom(nameRoom: string) {
    // Server-side
    this.gameServer.define(nameRoom, MyRoom)
    this.logger.debug(`${this.defineRoom.name} ${nameRoom}`);
  }

  async createdRoom() {
    this.logger.info('createRoom');
    const roomListData: RoomListingData = await matchMaker.createRoom(ROOM_NAME, {});
    this.room = <MyRoom>matchMaker.getRoomById(roomListData.roomId);
    this.logger.debug(`${this.createdRoom.name} ${this.room.roomId}`);
  }

}