import React, { useEffect, useState } from 'react';
import { getItems, createItem, updateItem, ITodoItem, IPagination } from '../api/api';
import Pagination from "./Pagination.tsx";

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<ITodoItem[]>([]);
    const [newTitle, setNewTitle] = useState<string>("");
    const [pagination, setPagination] = useState<IPagination | null>(null);
    const [currentPage, setCurrentPage] = useState<string | null>(null);

    // Fetch Todos from the API
    const fetchTodos = async (page: string | null) => {
        try {
            const data = await getItems(page);
            setTodos(data.resources);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Error fetching todos", error);
        }
    };

    useEffect(() => {
        fetchTodos(currentPage);
    }, [currentPage]);

    // Handle creating a new Todo
    const handleCreateTodo = async () => {
        if (!newTitle.trim()) return;

        try {
            // const newTodo: Omit<ITodoItem, "id" | "createdAt" | "updatedAt"> = {
            //     userId: 1, // Replace with actual user ID
            //     title: newTitle,
            //     completed: false,
            // };

            const response = await createItem(newTitle);
            setTodos([response, ...todos]);
            setNewTitle("");
        } catch (error) {
            console.error("Error creating todo", error);
        }
    };

    // Handle toggling the 'completed' status
    const handleToggleCompleted = async (id: string) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        try {
            const updatedTodo = { ...todo, completed: !todo.completed };
            const response = await updateItem(updatedTodo);

            setTodos(todos.map((t) => (t.id === id ? response : t)));
        } catch (error) {
            console.error("Error updating todo", error);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Todo List</h1>

            {/* Form to create a new Todo */}
            <div className="mb-3">
                <div className="input-group">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="New todo title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button onClick={handleCreateTodo}>Add Todo</button>
                </div>
            </div>

                {/* List of Todos */}
            <ul className="list-group">
                {todos.map((todo) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={todo.id}>
                        <input
                            type="checkbox"
                            className="form-check-input me-2"
                            checked={todo.completed}
                            onChange={() => handleToggleCompleted(todo.id)}
                        />
                        <span>{todo.title}</span>
                        <small className="text-muted ms-3">Updated: {new Date(todo.updatedAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            {/* IPagination Controls */}
            {pagination && (
                <Pagination
                    totalPages={pagination.totalPages}
                    nextPageUrl={pagination.nextPage}
                    prevPageUrl={pagination.prevPage}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
            };


export default TodoList;
