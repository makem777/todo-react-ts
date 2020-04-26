import React, { createContext, Dispatch, useReducer, useContext } from 'react';
import { TodoDB } from '../app/data';
import { createAsyncDispatcher, createAsyncHandler, IAsyncState } from '../Action/AsyncActionUtils';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
}

type TodoState = Todo[];

export interface ITodoState extends IAsyncState{
  data?: TodoState,
}

const initialState: ITodoState = {
  loading: false,
  data: undefined,
  error: '',
}

const todosHandler = createAsyncHandler('GET_TODOS', 'todos');

const TodoStateContext = createContext<ITodoState | undefined>(undefined);
const todoDB = new TodoDB();

type Action =
  | { type: 'GET_TODOS'; }
  | { type: 'GET_TODOS_SUCCESS'; }
  | { type: 'GET_TODOS_ERROR'; }
  | { type: 'CREATE'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'REMOVE'; id: number }

type TodosDispatch = Dispatch<Action>;
const TodosDispatchContext = createContext<TodosDispatch | undefined>(
  undefined
);

function todosReducer(state: ITodoState, action: Action): ITodoState {
  switch (action.type) {
    case 'GET_TODOS':
    case 'GET_TODOS_SUCCESS':
    case 'GET_TODOS_ERROR':
      return todosHandler(state, action);
    case 'CREATE':
      console.log('CREATE');
      if (!state.data) {
        state.data = [];
      }
      const nextId = Math.max(0,...state.data.map(todo => todo.id)) + 1;
      const newTodo: Todo = {
        id: nextId,
        text: action.text,
        done: false,
      };
      console.log(newTodo);
      todoDB.todos.put(newTodo);
      return { ...state, data: state.data.concat(newTodo) };
    case 'TOGGLE':
      console.log('TOGGLE');
      if (!state.data) return state;
      return {...state, data: state.data.map((todo) => {
        if (todo.id === action.id) {
          todoDB.todos.update(action.id, { ...todo, done : !todo.done });
          return { ...todo, done: !todo.done }
        } else {
          return todo;
        }
      })};
    case 'REMOVE':
      console.log('REMOVE');
      if (!state.data) return state;
      todoDB.todos.delete(action.id);
      return { ...state, data: state.data.filter(todo => todo.id !== action.id) };
    default:
      throw new Error('Unhandled action');
  }
}

export function TodosContextProvider({ children }: { children: React.ReactNode }){
  // const isLoaded: Boolean = false;
  console.log(initialState);
  const [state, dispatch] = useReducer(todosReducer, initialState);
  return (
    <TodosDispatchContext.Provider value={dispatch}>
      <TodoStateContext.Provider value={state}>
        {children}
      </TodoStateContext.Provider>
    </TodosDispatchContext.Provider>
  );
}

export function useTodosState() {
  const state = useContext(TodoStateContext);
  if(!state) throw new Error('TodosProvider not found');
  return state;
}

export function useTodoDispatch() {
  const dispatch = useContext(TodosDispatchContext);
  if(!dispatch) throw new Error('TodosProvider not found');
  return dispatch;
}

export const getTodos = createAsyncDispatcher('GET_TODOS', () => {
  return todoDB.todos.orderBy('id').toArray();
});