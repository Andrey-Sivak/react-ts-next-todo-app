import {create} from 'zustand'
import {getTodosGroupedByColumn} from "@/lib/getTodosGroupedByColumn";
import {Board, Column, Image, Todo, TypedColumn} from "@/typings";
import {databases, ID, storage} from "@/appwrite";
import uploadImage from "@/lib/uploadImage";

// import { devtools, persist } from 'zustand/middleware'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    deleteTodo: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
    newTaskInput: string;
    setNewTaskInput: (newTaskInput: string) => void;
    newTaskType: TypedColumn,
    setNewTaskType: (columnId: TypedColumn) => void;
    image: File | null;
    setImage: (image: File | null) => void;
    addTodo: (todo: string, columnId: TypedColumn, image?: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    searchString: '',
    newTaskInput: '',
    newTaskType: 'todo',
    image: null,

    setSearchString(searchString) {
        return set({searchString})
    },

    setNewTaskInput(newTaskInput) {
        return set({newTaskInput})
    },

    setNewTaskType(columnId) {
        return set({newTaskType: columnId})
    },

    async getBoard() {
        const board = await getTodosGroupedByColumn();
        set({board})
    },

    setBoardState(board) {
        return set({board});
    },

    setImage(image) {
        return set({image});
    },

    async updateTodoInDB(todo, columnId) {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId
            }
        )
    },

    async addTodo(todo: string, columnId: TypedColumn, image?: File | null) {
        let file: Image | undefined;

        if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id
                };
            }
        }

        const {$id} = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                ...(file && {image: JSON.stringify(file)}),
            }
        )

        set({newTaskInput: ''});
        set((state) => {
            const newColumns = new Map(state.board.columns);

            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && {image: file})
            }

            const column = newColumns.get(columnId);

            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }

            return{
                board: {
                    columns: newColumns,
                }
            }
        })
    },

    async deleteTodo(taskIndex, todo, id) {
        const newColumns = new Map(get().board.columns);

        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({board: {columns: newColumns}});

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        )
    }
}))