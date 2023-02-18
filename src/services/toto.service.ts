
import { FindManyOptions } from 'typeorm'
import { getLogger } from '../../utils/logger'
import { AppDataSource } from '../data-source'
import { Todo } from "../entities/todo.entity"

export class TodoService {

  private readonly logger = getLogger(TodoService.name);
  private TodoRepository = AppDataSource.getRepository(Todo)


  public async create(data: Partial<Todo>): Promise<Todo> {
    this.logger.debug(`${this.create.name} start`);
    const todo = Object.assign(new Todo(), data)

    const savedTodo = await this.TodoRepository.save(todo);
    this.logger.debug(`${this.create.name} end`);
    return savedTodo;
  }

  public async readMany(options?: FindManyOptions<Todo>): Promise<Todo[]> {
    this.logger.debug(`${this.readMany.name} start`);
    const todos = await this.TodoRepository.find(options);
    this.logger.debug(`${this.readMany.name} end`);
    return todos;
  }

  public async readOne(id: number): Promise<Todo> {
    this.logger.debug(`${this.readOne.name} start`);
    const todo = await this.TodoRepository.findOne({ where: { id } });
    this.logger.debug(`${this.readOne.name} end`);
    return todo;
  }

  public async update(id: number, updateData: Partial<Todo>): Promise<Todo> {
    this.logger.debug(`${this.update.name} start`);
    await this.TodoRepository.update({ id }, updateData);
    const updatedTodo = await this.readOne(id);
    this.logger.debug(`${this.update.name} end`);
    return updatedTodo;
  }

  public async delete(id: number): Promise<Todo> {
    this.logger.debug(`${this.delete.name} start`);
    const updatedTodo = await this.readOne(id);
    await this.TodoRepository.delete({ id });
    this.logger.debug(`${this.delete.name} end`);
    return updatedTodo;
  }

}