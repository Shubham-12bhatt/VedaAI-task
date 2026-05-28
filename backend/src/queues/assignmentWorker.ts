import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { Assignment } from "../models/Assignment";
import { emitStatusUpdate } from "../socket/socketServer";
import { generateQuestionsForAssignment } from "./questionGenerator";

const QUEUE_NAME = "assignment-generation";

// Helper function to create a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const assignmentWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { assignmentId } = job.data;
    console.log(`Worker processing job ${job.id} for assignment: ${assignmentId}`);

    try {
      // 1. Fetch the assignment
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        throw new Error(`Assignment with ID ${assignmentId} not found`);
      }

      // Step 0: Initialized/pending state. We can delay a bit.
      await delay(1200);

      // 2. Set to processing and broadcast
      assignment.status = "processing";
      await assignment.save();
      emitStatusUpdate(assignmentId, "processing");

      // Step 1: Formulating question patterns
      await delay(1500);

      // 3. Generate questions
      const generated = generateQuestionsForAssignment(
        assignment.questionTypes,
        assignment.difficulty || "Medium",
        assignment.title
      );

      // Step 2: Finalizing rubrics & layout
      await delay(1500);

      // 4. Update assignment with generated questions and change status to completed
      const generatedPaper = {
        subject: generated.subject,
        className: generated.className,
        timeAllowed: assignment.duration || "2 Hours",
        maxMarks: assignment.totalMarks,
        questions: generated.questions,
      };

      assignment.status = "completed";
      assignment.generatedPaper = generatedPaper;
      await assignment.save();

      // 5. Broadcast success
      emitStatusUpdate(assignmentId, "completed", { generatedPaper });
      console.log(`Worker completed job ${job.id} for assignment: ${assignmentId}`);
    } catch (error: any) {
      console.error(`Worker failed job ${job.id} for assignment ${assignmentId}:`, error);

      // Update DB to failed
      try {
        const assignment = await Assignment.findById(assignmentId);
        if (assignment) {
          assignment.status = "failed";
          await assignment.save();
        }
      } catch (dbErr) {
        console.error("Failed to update assignment status to failed in DB:", dbErr);
      }

      // Broadcast failure
      emitStatusUpdate(assignmentId, "failed", { error: error.message });
      throw error;
    }
  },
  {
    connection: redisConnection as any,
    concurrency: 1,
  }
);

console.log("BullMQ Worker listening for assignment-generation jobs...");
