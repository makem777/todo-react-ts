import Dexie from "dexie";
import { Todo } from '../context/TodosDBContext';

export class TodoDB extends Dexie {
  public todos: Dexie.Table<Todo, number>;

  public constructor() {
    super('TodoDB');
    this.version(1).stores({
      todos: '++id,text,boolean',
    });
    this.todos = this.table('todos');
  }

  // public async loadData(){
  //   return await this.todos.orderBy('id').toArray();
  // }
}
