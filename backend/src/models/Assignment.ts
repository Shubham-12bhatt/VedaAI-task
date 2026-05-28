import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  id: string;
  number: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  text: string;
  marks: number;
  answer: string;
}

export interface IFileData {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface IQuestionType {
  id: string;
  type: string;
  numQuestions: number;
  marks: number;
}

export interface IGeneratedPaper {
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  questions: IQuestion[];
}

export interface IAssignment extends Document {
  title: string;
  dueDate: string;
  sections: string[];
  questionTypes: IQuestionType[];
  totalMarks: number;
  totalQuestions: number;
  status: "pending" | "processing" | "completed" | "failed";
  generatedPaper: IGeneratedPaper | null;
  additionalInfo?: string;
  difficulty?: string;
  duration?: string;
  customDuration?: string;
  outputFormat?: string;
  file?: IFileData | null;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema(
  {
    id: { type: String },
    type: { type: String },
    numQuestions: { type: Number },
    marks: { type: Number },
  },
  { _id: false }
);

const QuestionSchema = new Schema(
  {
    id: { type: String },
    number: { type: Number },
    difficulty: { type: String, enum: ["Easy", "Moderate", "Challenging"] },
    text: { type: String },
    marks: { type: Number },
    answer: { type: String },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema(
  {
    subject: { type: String },
    className: { type: String },
    timeAllowed: { type: String },
    maxMarks: { type: Number },
    questions: { type: [QuestionSchema], default: [] },
  },
  { _id: false }
);

const FileDataSchema = new Schema(
  {
    name: { type: String },
    size: { type: Number },
    type: { type: String },
    previewUrl: { type: String },
  },
  { _id: false }
);

const AssignmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: String, required: true },
    sections: { type: [String], default: [] },
    questionTypes: { type: [QuestionTypeSchema], default: [] },
    totalMarks: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    generatedPaper: {
      type: GeneratedPaperSchema,
      default: null,
    },
    additionalInfo: { type: String, default: "" },
    difficulty: { type: String, default: "Medium" },
    duration: { type: String, default: "2 Hours" },
    customDuration: { type: String, default: "" },
    outputFormat: { type: String, default: "PDF Document" },
    file: {
      type: FileDataSchema,
      default: null,
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
