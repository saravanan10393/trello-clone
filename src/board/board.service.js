import { DataService } from "../service/data.service.js";

export const BoardService = {
  getBoardInfo() {
    //optionally include the Status inside in the info api of board, so that 
    // ui can avoid one extra api call to render the board. We will not expose this option in
    //customer api docs. only inside product.
    return DataService.get("/board/board001/info?includeStatus=true")
  },
  getTaskList() {
    return DataService.get("/board/board001/tasks")
  },
  getStatus() {
    return DataService.get("/board/board001/status")
  },
  moveCard(data) {
    return DataService.post("/board/board001/task/:taskId/:statusId/move", {
      data: {}
    })
  },
  updateCard() {
    return DataService.post("/board/board001/task/:taskId/update", {
      data: {}
    })
  }
}