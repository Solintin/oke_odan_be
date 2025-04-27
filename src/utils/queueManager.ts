import { QueueType } from "@src/interfaces/enum.interface";
import { Job, Queue, Worker } from "bullmq";
import Redis from "ioredis";
import logger from "./logger";
import { MailOptions } from "@src/interfaces/mail.interface";
import redisClient from "@src/client/redis.client";

class QueueManager<T> {
  public queue: Queue<T>;
  private worker: Worker<T>;

  constructor(private queueName: QueueType, private connection: Redis) {
    this.queueName = queueName;
    this.queue = new Queue(queueName, { connection });
  }

  public async addJob(jobData: T): Promise<Job<T>> {
    const job = await this.queue.add(this.queueName as any, jobData, {
      delay: 5000,
    });
    return job;
  }

  async startWorker(jobHandler: (data: T) => Promise<unknown>): Promise<void> {
    this.worker = new Worker(
      this.queueName,
      async (job) => {
        await jobHandler(job.data);
      },
      { connection: this.connection }
    );
    this.worker.on("completed", async (job) => {
      logger.debug(`Job ${job.id} completed`);
      await job.remove();
    });

    this.worker.on("failed", (job, err) => {
      logger.log("error", `Job ${job.id} failed: ${err}`);
    });
  }
}

const mailQueue = new QueueManager<MailOptions>(QueueType.Mail, redisClient);

export { mailQueue };
