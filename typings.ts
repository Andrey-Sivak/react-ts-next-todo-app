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
