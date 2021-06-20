import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import styles from "./board.module.css";

import { TaskCard } from "./card.jsx";

export function StatusList({ statusList, tasksByStatus, onDrop }) {
  const onDragEnd = React.useCallback((result) => {
    console.log("drag end calling", result);
    let { destination } = result;

    if(!destination) return;

    onDrop(result);
  }, [onDrop]);

  const onDragStart = React.useCallback((result) => {
    console.log("drag start calling", result);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className={styles.statusList}>
        {statusList.map((status) => {
          return (
            <StatusColumn
              key={status.Id}
              status={status}
              taskList={tasksByStatus[status.Id] || []}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}

function StatusColumn({ status, taskList }) {
  return (
    <div className={styles.status}>
      <div className={styles.statusHeader}>
        <h4>{status.Name}</h4>
      </div>
      <Droppable droppableId={status.Id} className={styles.cardList}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={{
              backgroundColor: snapshot.isDraggingOver ? "blue" : "grey",
            }}
            {...provided.droppableProps}
            className={styles.cardList}
          >
            {taskList.map((task, index) => {
              return (
                <Draggable key={task.Id} draggableId={task.Id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} key={task.Id} />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
