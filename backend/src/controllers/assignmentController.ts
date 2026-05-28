import { Request, Response, NextFunction } from "express";
import { Assignment } from "../models/Assignment";
import { addAssignmentJob } from "../queues/assignmentQueue";

export const assignmentController = {
  /**
   * Fetches the complete list of assignments, sorted by creation date.
   */
  getAssignments: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignments = await Assignment.find().sort({ createdAt: -1 });
      res.status(200).json(assignments);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Fetches details of a specific assignment by its MongoDB ID.
   */
  getAssignmentById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findById(id);
      
      if (!assignment) {
        res.status(404).json({ error: "Assignment not found" });
        return;
      }
      
      res.status(200).json(assignment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Validates and registers a new assignment, triggering a generation task.
   */
  createAssignment: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        title,
        dueDate,
        sections,
        questionRows,
        additionalInfo,
        difficulty,
        duration,
        customDuration,
        outputFormat,
        file,
      } = req.body;

      // Inline validation checks
      if (!title || !title.trim()) {
        res.status(400).json({ error: "Assignment title is required" });
        return;
      }

      if (!dueDate) {
        res.status(400).json({ error: "Due date is required" });
        return;
      }

      // Calculate aggregated fields
      const totalQuestions = questionRows
        ? questionRows.reduce((sum: number, row: any) => sum + (parseInt(row.numQuestions, 10) || 0), 0)
        : 0;

      const totalMarks = questionRows
        ? questionRows.reduce(
            (sum: number, row: any) =>
              sum + (parseInt(row.numQuestions, 10) || 0) * (parseInt(row.marks, 10) || 0),
            0
          )
        : 0;

      // Transform frontend rows into the model schema shape
      const questionTypes = questionRows
        ? questionRows.map((row: any) => ({
            id: row.id,
            type: row.type,
            numQuestions: parseInt(row.numQuestions, 10) || 0,
            marks: parseInt(row.marks, 10) || 0,
          }))
        : [];

      // Create mongoose document
      const assignment = new Assignment({
        title: title.trim(),
        dueDate,
        sections: sections || [],
        questionTypes,
        totalQuestions,
        totalMarks,
        status: "pending",
        additionalInfo: additionalInfo || "",
        difficulty: difficulty || "Medium",
        duration: duration || "2 Hours",
        customDuration: customDuration || "",
        outputFormat: outputFormat || "PDF Document",
        file: file || null,
        generatedPaper: null,
      });

      await assignment.save();

      // Trigger background worker job
      await addAssignmentJob(assignment._id.toString());

      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  },
};
export default assignmentController;
