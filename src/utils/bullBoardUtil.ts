import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import { mailQueue } from "./queueManager";
import { IServerAdapter } from "@bull-board/api/dist/typings/app";

class BullBoardUtil {
  private serverAdapter: ExpressAdapter;

  constructor(private queues: Queue[]) {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath("/dev/queue-board");

    const queueAdapters = this.queues.map((queue) => {
      return new BullMQAdapter(queue);
    });

    createBullBoard({
      queues: queueAdapters,
      serverAdapter: this.serverAdapter as unknown as IServerAdapter,
      options: {
        uiConfig: {
          boardTitle: "FoodClique Queues",
        },
      },
    });
  }

  getRouter() {
    return this.serverAdapter.getRouter();
  }
}

export default new BullBoardUtil([mailQueue.queue]);
