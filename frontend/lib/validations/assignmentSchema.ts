import { z } from "zod";

// Validator for uploaded files (PDF & TXT only, max size 10MB)
export const fileSchema = z.object({
  name: z.string().min(1, "File name is required"),
  size: z.number().max(10 * 1024 * 1024, "File size must not exceed 10MB limit"),
  type: z.string().refine(
    (type) => ["application/pdf", "text/plain"].includes(type) || type === "" || type === "text/markdown",
    "Only PDF and TXT files are allowed"
  ),
  previewUrl: z.string().optional(),
});

// Validator for question configuration rows
export const questionRowSchema = z.object({
  id: z.string(),
  type: z.string().min(1, "Question type is required"),
  numQuestions: z.number()
    .int("Questions must be an integer")
    .positive("Number of questions must be positive"),
  marks: z.number()
    .int("Marks must be an integer")
    .positive("Total marks must be positive"),
});

// Main assignment form validator
export const assignmentSchema = z.object({
  title: z.string().min(1, "Assignment title is required"),
  dueDate: z.string()
    .min(1, "Due date is required")
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format")
    .refine((dateStr) => {
      const parts = dateStr.split("-");
      if (parts.length !== 3) return false;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      
      const dateObj = new Date(year, month - 1, day);
      return (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
      );
    }, "Please enter a valid calendar date"),
  file: fileSchema.nullable(),
  questionRows: z.array(questionRowSchema).min(1, "At least one question type is required"),
  additionalInfo: z.string(),
  
  // Step 2 Configs
  difficulty: z.string(),
  duration: z.string(),
  customDuration: z.string(),
  sections: z.array(z.string()).min(1, "Please select at least one section to include"),
  outputFormat: z.string(),
}).refine((data) => data.file !== null, {
  message: "Please upload a reference document (PDF or TXT)",
  path: ["file"],
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;
export type FileDataValues = z.infer<typeof fileSchema>;
