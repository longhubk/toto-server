import { AppDataSource } from '../data-source'
import { NextFunction, Request, Response } from "express"
import { Todo } from "../entities/todo.entity"

export class TodoController {

  private TodoRepository = AppDataSource.getRepository(Todo)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.TodoRepository.find()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id)


    const Todo = await this.TodoRepository.findOne({
      where: { id }
    })

    if (!Todo) {
      return "unregistered Todo"
    }
    return Todo
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { title, description, completed } = request.body;

    const todo = Object.assign(new Todo(), {
      title, description, completed
    })

    return this.TodoRepository.save(todo)
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { title, description, completed } = request.body;
    const { id } = request.params;


    let TodoToUpdate = await this.TodoRepository.findOneBy({ id: Number(id) })

    if (!TodoToUpdate) {
      return "this Todo not exist"
    }

    await this.TodoRepository.update({ id: Number(id) }, { title, description, completed })

    return "Todo has been updated"
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id)

    let TodoToRemove = await this.TodoRepository.findOneBy({ id })

    if (!TodoToRemove) {
      return "this Todo not exist"
    }

    await this.TodoRepository.remove(TodoToRemove)

    return "Todo has been removed"
  }

}