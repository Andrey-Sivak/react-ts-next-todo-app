import {create} from 'zustand'
import {getTodosGroupedByColumn} from "@/lib/getTodosGroupedByColumn";
import {Board, Column, Todo, TypedColumn} from "@/typings";
import {databases} from "@/appwrite";

// import { devtools, persist } from 'zustand/middleware'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    searchString: '',

    setSearchString(searchString) {
        return set({searchString})
    },

    async getBoard() {
        const board = await getTodosGroupedByColumn();
        set({board})
    },

    setBoardState(board) {
        return set({board});
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
    }
}))