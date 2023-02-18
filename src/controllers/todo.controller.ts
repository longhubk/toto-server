import { NextFunction, Request, Response } from "express";
import { getLogger } from '../../utils/logger';
import { Todo } from "../entities/todo.entity";
import { TodoService } from "../services/toto.service";
import { Game } from '../sync/game';

export class TodoController {

  private readonly logger = getLogger(TodoController.name);
  private readonly gameCtx: Game;
  private readonly totoService: TodoService;
  constructor(game: Game) {
    this.gameCtx = game;
    this.totoService = new TodoService();
  }

  async all(request: Request, response: Response, next: NextFunction) {
    this.logger.info(`${this.all.name} start`);
    const todos = await this.totoService.readMany();
    for (const todo of todos) {
      this.gameCtx.room.onUpdateTodo(todo);
    }
    return todos;
  }

  async one(request: Request, response: Response, next: NextFunction) {
    this.logger.info(`${this.all.name} one`);
    const id = parseInt(request.params.id)

    const todo = await this.totoService.readOne(id)

    if (!todo) {
      return "unregistered Todo"
    } else {
      this.gameCtx.room.onUpdateTodo(todo);
    }
    return todo
  }

  async save(request: Request, response: Response, next: NextFunction) {
    this.logger.info(`${this.save.name} one`);
    const { title, description, completed } = request.body;

    const todo: Partial<Todo> = {
      title, description, completed
    };
    const savedTodo = await this.totoService.create(todo)
    this.gameCtx.room.onCreateTodo(savedTodo);
    return savedTodo;
  }

  async update(request: Request, response: Response, next: NextFunction) {
    this.logger.info(`${this.update.name} one`);
    const { title, description, completed } = request.body;
    const { id } = request.params;

    const _id = Number(id);

    let TodoToUpdate = await this.totoService.readOne(_id);

    if (!TodoToUpdate) {
      return "this Todo not exist"
    }

    const updatedTodo = await this.totoService.update(_id, { title, description, completed })

    this.gameCtx.room.onUpdateTodo(updatedTodo);

    return "Todo has been updated"
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    this.logger.info(`${this.remove.name} one`);
    const id = parseInt(request.params.id)

    let TodoToRemove = await this.totoService.readOne(id)

    if (!TodoToRemove) {
      return "this Todo not exist"
    }

    const removedTodo = await this.totoService.delete(id);

    this.gameCtx.room.onDeleteTodo(removedTodo);

    return "Todo has been removed"
  }

}