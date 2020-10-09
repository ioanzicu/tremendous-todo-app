import { Data } from './CustomTypes';

export function saveOnLocal(data: Data[]): void {
    localStorage.setItem('todoList', JSON.stringify(data));
}

export function getDataFromLocal(): Data[] {
    let todoList = localStorage.getItem('todoList');
    let data = todoList !== null ? JSON.parse(todoList) : [];
    return data;
}