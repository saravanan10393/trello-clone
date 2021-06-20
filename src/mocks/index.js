import { setupWorker } from "msw";

import { BoardMocks } from "./board.mock.js";

const worker = setupWorker(...BoardMocks);

worker.start();
