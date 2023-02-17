import { TodoController } from "./controller/todo.controller"

export const Routes = [
  {
    method: "get",
    route: "/todos",
    controller: TodoController,
    action: "all"
  },
  {
    method: "get",
    route: "/todos/:id",
    controller: TodoController,
    action: "one"
  },
  {
    method: "post",
    route: "/todos",
    controller: TodoController,
    action: "save"
  },
  {
    method: "put",
    route: "/todos/:id",
    controller: TodoController,
    action: "update"
  },
  {
    method: "delete",
    route: "/todos/:id",
    controller: TodoController,
    action: "remove"
  }
]