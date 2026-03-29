import { Queue, Worker, Job } from "bullmq";
import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

export const EMAIL_QUEUE_NAME = "email-queue";

export interface EmailJobData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

let connection: Redis | null = null;
export let emailQueue: any = null;

if (REDIS_URL) {
  connection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
  });

  emailQueue = new Queue(EMAIL_QUEUE_NAME, {
    // @ts-expect-error type mismatch with ioredis versions
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
}

export const addEmailToQueue = async (data: EmailJobData) => {
  if (emailQueue) {
    return await emailQueue.add(`send-email-${Date.now()}`, data);
  } else {
    console.warn("Redis is not configured. Email NOT queued:", data.subject);
    return null;
  }
};
