import { Schema, MapSchema, type } from "@colyseus/schema";

// class Player extends Schema {
//   @type("number") x: number;
//   @type("number") y: number;
// }
export type TodoData = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export class Todo extends Schema {
  @type("number") id: number;
  @type("string") title: string;
  @type("string") description: string;
  @type("boolean") completed: boolean;
}

export class MyState extends Schema {
  // @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Todo }) todos = new MapSchema<Todo>();

  createNewTodo(id: number, todo: TodoData) {
    const _id = String(id);
    if (!this.todos.get(_id)) {
      this.todos.set(_id,
        new Todo(todo)
      )
      console.log(`Todo ${_id} created`);
    } else {
      console.log(`Todo ${_id} existed`);
    }
  }

  updateToDo(id: number, todo: TodoData) {
    const _id = String(id);
    const existedTodo = this.todos.get(_id);
    if (existedTodo) {
      // existedTodo.id = todo.id || existedTodo.id;
      // existedTodo.title = todo.title || existedTodo.title;
      // existedTodo.description = todo.description || existedTodo.description;
      // existedTodo.completed = todo.completed || existedTodo.completed;
      this.todos.delete(_id);
      this.createNewTodo(id, todo);

      console.log(`Todo ${_id} updated`);
    } else {
      this.createNewTodo(id, todo);
      console.log(`Todo ${_id} not existed`);
    }
  }

  deleteTodo(id: number) {
    const _id = String(id);
    const existedTodo = this.todos.get(_id);
    if (existedTodo) {
      this.todos.delete(_id);
      console.log(`Todo ${_id} deleted`);
    } else {
      console.log(`Todo ${_id} not existed`);
    }
  }
}