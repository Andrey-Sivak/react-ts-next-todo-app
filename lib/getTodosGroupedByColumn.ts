import {databases} from "@/appwrite";
import {Board, Column, ETypedColumn} from "@/typings";

export const getTodosGroupedByColumn = async () => {
    const data = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
    )

    const todos = data.documents;

    const columns = todos.reduce((acc, todo) => {
        const status = todo.status as ETypedColumn;

        if (!acc.get(status)) {
            acc.set(status, {
                id: status,
                todos: [],
            })
        }

        (acc.get(status) as Column)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: status,
            // get the image if it exist on the todo
            ...(todo.image && {image: JSON.parse(todo.image)})
        });

        return acc;
    }, new Map<ETypedColumn, Column>);

    /** Add empty columns for statuses without todos */
    const columnTypes = Object.values(ETypedColumn);

    columnTypes.forEach((columnType) => {
        if (!columns.has(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: []
            })
        }
    })

    const sortedColumns = new Map(
        Array.from(columns.entries()).sort((a, b) => (
            columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        ))
    );

    const board: Board = {
        columns: sortedColumns
    }

    return board;
};
