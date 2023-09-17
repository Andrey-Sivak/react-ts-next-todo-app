import {Board, Todo, ETypedColumn} from "@/typings";

const formatTodosForAi = (board: Board) => {
    const todos = Array.from(board.columns.entries());

    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in ETypedColumn]: Todo[] });

    return Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            map[key as ETypedColumn] = value.length;
            return map;
        },
        {} as { [key in ETypedColumn]: number }
    );
}

export default formatTodosForAi;