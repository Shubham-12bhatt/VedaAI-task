import { QuestionType } from "./questionPaper";

export interface FileData {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface QuestionRowType {
  id: string;
  type: string;
  numQuestions: number;
  marks: number;
}

export interface FormErrors {
  title?: string;
  file?: string;
  dueDate?: string;
  questionRows?: string;
  sections?: string;
}

export interface Assignment {
  id: string;
  title: string;
  file: FileData | null;
  dueDate: string;
  questionRows: QuestionRowType[];
  additionalInfo: string;
  
  // Step 2 AI Config fields
  difficulty: string;
  duration: string;
  customDuration: string;
  sections: string[];
  outputFormat: string;
  
  totalQuestions: number;
  totalMarks: number;
  createdAt: string; // E.g., Assigned on date
  status?: string;

  // Output rendering fields
  questions?: QuestionType[];
  subject?: string;
  className?: string;
}
