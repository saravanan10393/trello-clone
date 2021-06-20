import React from "react";

import { BoardService } from "./board.service.js";

import { StatusList } from "./status.list.jsx";

import styles from "./board.module.css";

export function TaskBoard() {
  let [boardInfo, setBoardInfo] = React.useState(null);
  let [tasksByStatus, setTasksByStatus] = React.useState({});

  React.useEffect(function getBoardInfo() {
    BoardService.getBoardInfo().then((boardInfo) => {
      console.log("boardInfo ", boardInfo);
      setBoardInfo(boardInfo);
    });
  }, []);

  React.useEffect(
    function getTaskList() {
      if (!boardInfo) return () => {};

      BoardService.getTaskList().then((taskList) => {
        let taskByStatus = taskList.reduce((acc, task) => {
          acc[task.Status] = acc[task.Status] || [];
          acc[task.Status].push(task);
          return acc;
        }, {});
        console.log("taskList by status", taskByStatus);
        setTasksByStatus(taskByStatus);
      });
    },
    [boardInfo]
  );

  const onDrop = React.useCallback(
    (result) => {
      console.log("drag end calling", result);
      let {
        source: { droppableId: draggedStatusId, index: draggedIndex },
        destination: { droppableId: droppedStatusId, index: droppedIndex },
      } = result;
      let draggedStatusItems = tasksByStatus[draggedStatusId];
      let droppedStatusItems = tasksByStatus[droppedStatusId];
      let draggedTask = draggedStatusItems[draggedIndex];

      let isRearragement = draggedStatusId === droppedStatusId;

      if (isRearragement) {
        let prevTask = droppedStatusItems[droppedIndex - 1];
        let nextTaks = droppedStatusItems[droppedIndex];
        let position = draggedTask.Position;
        if (prevTask & nextTaks) {
          //dropped in middle
          position = (prevTask.Position + nextTaks.Position) / 2;
        } else if (prevTask && !nextTaks) {
          //dropped at end
          position = prevTask.Position + 1024;
        } else if (nextTaks && !prevTask) {
          //dropped at start
          position = nextTaks.Position / 2;
        }
        draggedTask.Position = position;

        droppedStatusItems.splice(draggedIndex, 1);
        droppedStatusItems.splice(droppedIndex, 0, draggedTask);
      } else {
        //drag and drop accross status
        draggedStatusItems.splice(draggedIndex, 1);

        draggedTask.Status = droppedStatusId;

        //insert items into destAray
        if (droppedIndex === 0) {
          //dropped at start;
          let nextTask = droppedStatusItems[droppedIndex];
          if (nextTask) {
            //udpate the position of task
            let position = nextTask.Position / 2;
            draggedTask.Position = position;
          }
          droppedStatusItems.unshift(draggedTask);
        } else if (!droppedStatusItems[droppedIndex]) {
          //dropped at end
          let prevTask = droppedStatusItems[droppedIndex - 1];
          if (prevTask) {
            //udpate the position of task
            let position = prevTask.Position + 1024;
            draggedTask.Position = position;
          }
          droppedStatusItems.push(draggedTask);
        } else {
          //dropped in the middle
          let prevTask = droppedStatusItems[droppedIndex - 1];
          let nextTask = droppedStatusItems[droppedIndex];
          if (prevTask && nextTask) {
            let position = (prevTask.Position + nextTask.Position) / 2;
            draggedTask.Position = position;
          }

          droppedStatusItems.splice(droppedIndex, 0, draggedTask);
        }
      }

      if (isRearragement) {
        //simply udpate task when re-arraging within same status
        BoardService.updateCard(draggedTask.Id, {
          Position: draggedTask.Position,
        });
      } else {
        //call move the task b/w status, so that no two drag and drop the same task into 2 differnt status
        BoardService.moveCard(draggedTask.Id, {
          sourceStatusId: draggedStatusId,
          targetStatusId: droppedStatusId,
          Position: draggedTask.Position,
        });
      }

      setTasksByStatus({
        ...tasksByStatus,
        [draggedStatusId]: [...draggedStatusItems],
        [droppedStatusId]: [...droppedStatusItems],
      });
    },
    [tasksByStatus]
  );

  return (
    boardInfo && (
      <div className={styles.board}>
        <BordHeader boardInfo={boardInfo} />
        {tasksByStatus && (
          <StatusList
            statusList={boardInfo.Status}
            tasksByStatus={tasksByStatus}
            onDrop={onDrop}
          />
        )}
      </div>
    )
  );
}

function BordHeader({ boardInfo }) {
  return (
    <div className={styles.boardHeader}>
      <h3>{boardInfo.Name}</h3>
      {/* Rest of board header options goes */}
    </div>
  );
}
