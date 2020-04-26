import React from 'react';
import TodoItem from './TodoItem';
import { useTodosState, useTodoDispatch, getTodos } from '../context/TodosDBContext';

function TodoList() {
	// const todos = useTodosState();
	const state = useTodosState();
	const dispatch = useTodoDispatch();

	const { data: todos, loading, error } = state;
	console.log(state);
	const fetchData = () => {
		console.log(dispatch);
		getTodos(dispatch);
	}

	if (loading) return (
		<div>로딩중...</div>
	)
	if (error) return (
		<div>
			에러발생...
			<button onClick={fetchData}>재시도></button>
		</div>
	)
	if (!todos) return (
		<button onClick={fetchData}>불러오기></button>
	)

	console.log(todos);
	return (
		<ul>
			{todos.map((todo) => (
				<TodoItem todo={todo} key={todo.id} />
			))}
			<button onClick={fetchData}>불러오기></button>
		</ul>
	);
}

export default TodoList;
