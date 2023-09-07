import {Board, Todo, TypedColumn} from "@/typings";

const formatTodosForAi = (board: Board) => {
    const todos = Array.from(board.columns.entries());

    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumn]: Todo[] });

    return Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            map[key as TypedColumn] = value.length;
            return map;
        },
        {} as { [key in TypedColumn]: number }
    );
}

export default formatTodosForAi;