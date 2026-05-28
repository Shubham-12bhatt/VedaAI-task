export interface QuestionType {
  id: string;
  number: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  text: string;
  marks: number;
  answer: string;
}

export interface QuestionPaper {
  id: string;
  assignmentId: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string[];
  questions: QuestionType[];
}
