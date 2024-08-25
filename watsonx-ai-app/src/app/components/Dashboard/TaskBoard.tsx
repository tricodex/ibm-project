import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FiPlus } from 'react-icons/fi';

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

const initialData: BoardData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
    'task-4': { id: 'task-4', content: 'Cook dinner' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const TaskBoard: React.FC = () => {
  const [boardData, setBoardData] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = boardData.columns[source.droppableId];
    const finish = boardData.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoardData(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...boardData,
      columns: {
        ...boardData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setBoardData(newState);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Task Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4">
          {boardData.columnOrder.map((columnId) => {
            const column = boardData.columns[columnId];
            const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

            return (
              <div key={column.id} className="w-1/3">
                <h3 className="font-semibold mb-2">{column.title}</h3>
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-2 rounded-lg min-h-[200px] ${
                        snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-gray-100'
                      }`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-2 mb-2 rounded-lg ${
                                snapshot.isDragging ? 'bg-white shadow-lg' : 'bg-white'
                              }`}
                            >
                              {task.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <button className="mt-2 flex items-center text-blue-500 hover:text-blue-600">
                  <FiPlus className="mr-1" /> Add a task
                </button>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;