import http from "http";
import { Room, Client } from "colyseus";
import { MyState, TodoData } from "./schema";
import { getLogger } from "../../utils/logger";

export class MyRoom extends Room<MyState> {
  // When room is initialized
  private readonly logger = getLogger(MyRoom.name);
  onCreate(options: any) {
    this.setState(new MyState());
    this.autoDispose = false;
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(client: Client, options: any, request: http.IncomingMessage) {
    // no authen
    this.logger.debug(`${this.onAuth.name} client: ${client.sessionId}`);
    return true;
  }

  onCreateTodo(todo: TodoData) {
    this.logger.debug(`${this.onCreateTodo.name} start ${JSON.stringify(todo, null, 2)}`);
    this.state.createNewTodo(todo.id, todo);
  }

  onUpdateTodo(todo: TodoData) {
    this.logger.debug(`${this.onUpdateTodo.name} start`);
    this.state.updateToDo(todo.id, todo);
  }

  onDeleteTodo(todo: TodoData) {
    this.logger.debug(`${this.onDeleteTodo.name} start`);
    this.state.deleteTodo(todo.id);
  }

  // When client successfully join the room
  onJoin(client: Client, options: any, auth: any) {
    this.logger.debug(`${this.onJoin.name} client: ${client.sessionId}`);
  }

  // When a client leaves the room
  onLeave(client: Client, consented: boolean) {
    this.logger.debug(`${this.onLeave.name} client: ${client.sessionId}`);
    if (this.clients.length === 0) {
      this.setState(new MyState());
    }
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {
    this.setState(new MyState());
  }
}