import { rest } from "msw";

let getBordInfo = rest.get("/board/:boardId/info", function(req, res, ctx) {
    let boardInfo = require("./board.info.json");
    if(req.url.search.includes("includeStatus")) {
      let statusList = require("./status.json");
      boardInfo["Status"] = statusList;
    }
    return res(ctx.status(200), ctx.json(boardInfo));
});

let getStatusList = rest.get("/board/:boardId/status", function(req, res, ctx) {
  let boardInfo = require("./status.json");
  return res(ctx.status(200), ctx.json(boardInfo));
});

let getTaskList =  rest.get("/board/:boardId/tasks", function(req, res, ctx) {
  let taskList = require("./task.list.json");
  return res(ctx.status(200), ctx.json(taskList));
});

let moveCard = rest.post("/board/:boardId/task/:taskId/:statusId/move", function(req, res, ctx) {
  return res(ctx.status(200), ctx.json({ success: true }));
});

let updateCard =  rest.post("/board/:boardId/task/:taskId/update", function(req, res, ctx) {
  return res(ctx.status(200), ctx.json({ success: true }));
});

export const BoardMocks = [
  getBordInfo,
  getTaskList,
  getStatusList,
  moveCard,
  updateCard
];
