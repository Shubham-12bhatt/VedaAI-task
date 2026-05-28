import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

const QUEUE_NAME = "assignment-generation";

// Create the BullMQ queue instance connected to our shared Redis instance
export const assignmentQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // wait 5 seconds before retrying
    },
    removeOnComplete: true, // Clean up successful jobs
    removeOnFail: false,   // Keep failed jobs for logging
  },
});

/**
 * Enqueues a task to generate questions for an assignment.
 */
export const addAssignmentJob = async (assignmentId: string): Promise<void> => {
  try {
    await assignmentQueue.add("generate-questions", { assignmentId });
    console.log(`BullMQ: Enqueued question generation job for assignment: ${assignmentId}`);
  } catch (error) {
    console.error(`BullMQ: Failed to enqueue job for assignment ${assignmentId}:`, error);
    throw error;
  }
};

export default assignmentQueue;
