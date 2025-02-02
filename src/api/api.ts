import axios from 'axios';

// Define the API base URL
const API_URL = 'http://localhost:5000';
const API_PATH = '/api/todos';

export const api = axios.create({
    baseURL: API_URL,
});

export interface ITodoItem {
    id: string;
    userId: number;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IPagination {
    total: number;
    totalPages: number;
    nextPage: string | null;
    prevPage: string | null;
}

// API Calls (CRUD)
export const getItems = async (url: string | null): Promise<{ resources: ITodoItem[]; pagination: IPagination }> => {
    const response = await api.get(url || API_PATH);
    return response.data;
};

export const getItem = async (id: number): Promise<ITodoItem> => {
    const response = await api.get(`${API_PATH}/${id}`);
    return response.data;
};

export const createItem = async (title: string): Promise<ITodoItem> => {
    const response = await api.post(API_PATH, {title});
    return response.data.resources;
};

export const updateItem = async (updates: ITodoItem): Promise<ITodoItem> => {
    const response = await api.put(`${API_PATH}/${updates.id}`, {completed: updates.completed});
    return response.data.resources;
};

export const deleteItem = async (id: number): Promise<void> => {
    await api.delete(`${API_PATH}/${id}`);
};
