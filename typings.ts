import {Models} from "appwrite";

export interface Board {
    columns: Map<ETypedColumn, Column>;
}

export enum ETypedColumn {
    Todo = 'todo',
    InProgress = 'inprogress',
    Done = 'done'
}

export interface Column {
    id: ETypedColumn;
    todos: Todo[];
}

export interface Todo extends Models.Document {
    $id: string;
    $createdAt: string;
    title: string;
    status: ETypedColumn;
    image?: Image;
}

export interface Image {
    bucketId: string;
    fileId: string;
}

export const settings = [
    {
        id: ETypedColumn.Todo,
        title: 'To Do',
        description: 'A new task to be completed',
        color: 'bg-red-500'
    },
    {
        id: ETypedColumn.InProgress,
        title: 'In Progress',
        description: 'A task that is currently being worked on',
        color: 'bg-yellow-500'
    },
    {
        id: ETypedColumn.Done,
        title: 'Done',
        description: 'A task that has been completed',
        color: 'bg-green-500'
    }
]