'use client';
import React, {useEffect} from "react";
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd';
import {useBoardStore} from "@/store/BoardStore";
import Column from "@/components/Column";
import {Column as ColumnType} from "@/typings";

const Board = () => {
    const [
        board,
        getBoard,
        setBoardState,
        updateTodoInDB
    ] = useBoardStore(state => [
        state.board,
        state.getBoard,
        state.setBoardState,
        state.updateTodoInDB
    ]);

    useEffect(() => {
        getBoard();
    }, [getBoard]);

    const handleOnDragEnd = (result: DropResult) => {
        const {destination, source, type} = result;

        if (!destination) return;

        if (type === 'column') {
            const entries = Array.from(board.columns.entries());
            const [removed] = entries.splice(source.index, 1);
            entries.splice(destination.index, 0, removed);
            const rearrangeColumns = new Map(entries);

            setBoardState({
                ...board, columns: rearrangeColumns
            });

            return;
        }

        const columns = Array.from(board.columns);
        const startColumnIndex = columns[Number(source.droppableId)];
        const endColumnIndex = columns[Number(destination.droppableId)];

        const startCol: ColumnType = {
            id: startColumnIndex[0],
            todos: startColumnIndex[1].todos,
        }

        const endCol: ColumnType = {
            id: endColumnIndex[0],
            todos: endColumnIndex[1].todos,
        }

        if (!startCol || !endCol) return;

        if (source.index === destination.index && startCol === endCol) return;

        const newTodos = startCol.todos;
        const [todoMoved] = newTodos.splice(source.index, 1);

        if (startCol.id === endCol.id) {
            newTodos.splice(destination.index, 0, todoMoved);

            const newCol = {
                id: startCol.id,
                todos: newTodos,
            }

            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, newCol);

            setBoardState({...board, columns: newColumns});
        } else {
            const endTodos = Array.from(endCol.todos);
            endTodos.splice(destination.index, 0, todoMoved);

            const newCol = {
                id: startCol.id,
                todos: newTodos,
            }

            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, newCol);
            newColumns.set(endCol.id, {
                id: endCol.id,
                todos: endTodos,
            });

            updateTodoInDB(todoMoved, endCol.id);

            setBoardState({...board, columns: newColumns});
        }
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="column">
                {(provided) => (
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto items-start"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {Array.from(board.columns.entries()).map(([id, column], index) => (
                            <Column
                                key={id}
                                id={id}
                                todos={column.todos}
                                index={index}
                            />
                        ))}
                    </div>
                )}

            </Droppable>
        </DragDropContext>
    )
}

export default Board;