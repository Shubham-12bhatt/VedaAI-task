import { create } from "zustand";
import { Assignment, FileData, QuestionRowType, FormErrors } from "@/types/assignment";
import { QuestionType } from "@/types/questionPaper";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

let socket: Socket | null = null;
const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_URL);
  }
  return socket;
};

function mapBackendAssignment(doc: any): Assignment {
  return {
    id: doc._id || doc.id,
    title: doc.title,
    file: doc.file || null,
    dueDate: doc.dueDate,
    questionRows: (doc.questionTypes || []).map((row: any) => ({
      id: row.id,
      type: row.type,
      numQuestions: row.numQuestions,
      marks: row.marks,
    })),
    additionalInfo: doc.additionalInfo || "",
    difficulty: doc.difficulty || "Medium",
    duration: doc.duration || "2 Hours",
    customDuration: doc.customDuration || "",
    sections: doc.sections || [],
    outputFormat: doc.outputFormat || "PDF Document",
    totalQuestions: doc.totalQuestions || 0,
    totalMarks: doc.totalMarks || 0,
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).replace(/\//g, "-")
      : new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).replace(/\//g, "-"),
    questions: doc.generatedPaper?.questions || [],
    subject: doc.generatedPaper?.subject || "",
    className: doc.generatedPaper?.className || "",
    status: doc.status,
  } as any;
}

export interface AssignmentStore {
  // Store core lists and states
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  generatedAssignment: Assignment | null; // Keeps backward compatibility with page.tsx
  generatedQuestionPaper: Assignment | null; // New state requested in Phase 2
  loading: boolean;
  isLoading: boolean; // Double bindings for maximum UI compatibility
  generationStatus: string;
  pdfGenerationState: "idle" | "generating" | "success" | "error";

  // Navigation and mode states
  isCreating: boolean;
  currentStep: number;

  // Search & Filter State
  searchQuery: string;
  filterDifficulty: string;
  filterFormat: string;

  // Step 1 Form State
  title: string;
  file: FileData | null;
  dueDate: string;
  questionRows: QuestionRowType[];
  additionalInfo: string;

  // Step 2 Form State
  difficulty: string;
  duration: string;
  customDuration: string;
  sections: string[];
  outputFormat: string;

  // Validation Errors
  errors: FormErrors;

  // Assessment State
  assessmentToggles: Record<string, boolean>;
  assessmentRubrics: Record<string, string[]>;
  assessmentExplanations: Record<string, string>;

  // Core Actions requested in Phase 2
  addAssignment: (assignment: Assignment) => void;
  removeAssignment: (id: string) => void;
  setGeneratedPaper: (paper: Assignment | null) => void;
  setLoading: (loading: boolean) => void;
  setGenerationStatus: (status: string) => void;

  // API Actions
  fetchAssignments: () => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<Assignment | null>;

  // Form actions and setters (UI backward compatibility)
  setCreating: (isCreating: boolean) => void;
  setStep: (step: number) => void;
  setTitle: (title: string) => void;
  setFile: (file: FileData | null) => void;
  setDueDate: (dueDate: string) => void;
  setAdditionalInfo: (info: string) => void;
  setGeneratedAssignment: (asm: Assignment | null) => void;
  setPdfGenerationState: (state: "idle" | "generating" | "success" | "error") => void;

  // Assessment actions
  setAssessmentToggle: (questionId: string, enabled: boolean) => void;
  setAssessmentRubrics: (questionId: string, rubrics: string[]) => void;
  setAssessmentExplanation: (questionId: string, explanation: string) => void;

  // Search & Filter Actions
  setSearchQuery: (query: string) => void;
  setFilterDifficulty: (difficulty: string) => void;
  setFilterFormat: (format: string) => void;
  deleteAssignment: (id: string) => Promise<boolean>;

  // Step 2 Actions
  setDifficulty: (difficulty: string) => void;
  setDuration: (duration: string) => void;
  setCustomDuration: (customDuration: string) => void;
  setSections: (sections: string[]) => void;
  toggleSection: (section: string) => void;
  setOutputFormat: (outputFormat: string) => void;

  // Row Actions
  addQuestionRow: (type?: string) => void;
  updateQuestionRow: (id: string, updates: Partial<Omit<QuestionRowType, "id">>) => void;
  deleteQuestionRow: (id: string) => void;

  // Form execution actions
  resetForm: () => void;
  validateStep: (step: number) => boolean;
  createAssignment: (onStepChange?: (step: number) => void) => Promise<Assignment | null>;
}

const DEFAULT_ROWS: QuestionRowType[] = [
  { id: "1", type: "Multiple Choice Questions", numQuestions: 4, marks: 1 },
  { id: "2", type: "Short Questions", numQuestions: 3, marks: 2 },
  { id: "3", type: "Diagram/Graph-Based Questions", numQuestions: 5, marks: 5 },
  { id: "4", type: "Numerical Problems", numQuestions: 5, marks: 5 },
];

const DEFAULT_SECTIONS = [
  "Section A - Multiple Choice Questions",
  "Section B - Short Questions",
];

const QUESTION_DATABASE: Record<string, Record<string, { text: string; answer: string }[]>> = {
  "Multiple Choice Questions": {
    Easy: [
      { text: "Which of the following is a good conductor of electricity?", answer: "Copper. Metals contain free electrons which allow easy flow of electric current." },
      { text: "The device used to prevent the flow of excess current in an electrical circuit is called a:", answer: "Fuse. It melts and breaks the circuit when current exceeds a safe limit." },
      { text: "Which of the following materials is an insulator?", answer: "Rubber. It does not contain free charge carriers." },
    ],
    Medium: [
      { text: "During the electrolysis of copper sulfate, copper ions deposit on:", answer: "The cathode. Positive copper ions (Cu2+) migrate to the negative electrode (cathode)." },
      { text: "Which of these solutions will NOT conduct electricity?", answer: "Sugar solution in distilled water. It does not dissociate into free ions." },
    ],
    Hard: [
      { text: "Which of the following conducting liquids exhibits the highest electrical conductivity?", answer: "1M Sodium Chloride solution. It has a high concentration of highly mobile ions." },
      { text: "During the electrolysis of acidified water, the ratio of hydrogen to oxygen gas evolved is:", answer: "2:1 by volume. H2O yields 2 parts H2 gas at the cathode and 1 part O2 gas at the anode." },
    ],
  },
  "Short Questions": {
    Easy: [
      { text: "Define electroplating. Explain its main purpose.", answer: "Electroplating is the deposition of a thin metal layer on another surface using electric current. Its purpose is to prevent corrosion and improve appearance." },
      { text: "Why does a solution of copper sulfate conduct electricity?", answer: "It dissociates into free Cu2+ and SO42- ions, which act as mobile charge carriers under an electric field." },
      { text: "Mention the type of current used in electroplating and justify why.", answer: "Direct Current (DC) is used to ensure a unidirectional and uniform migration of metal cations to the cathode." },
    ],
    Medium: [
      { text: "What is the role of a conductor in the process of electrolysis?", answer: "Conductors (electrodes) carry electric current from the external circuit into the electrolyte to drive chemical changes." },
      { text: "Describe one example of the chemical effect of electric current in daily life.", answer: "An example is gold plating cheap copper jewelry to make it look premium and prevent oxidation." },
      { text: "Explain why electric current is said to have chemical effects.", answer: "When electric current passes through an electrolyte, it induces chemical reactions like gas evolution and metal deposition." },
      { text: "What is the importance of electric current in the field of metallurgy?", answer: "It is used for electro-refining metals (like copper) and electro-extraction of highly reactive metals (like aluminum)." },
    ],
    Hard: [
      { text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction.", answer: "Brine (aq NaCl) is electrolyzed in the Chloralkali process. At anode: Cl2 gas; at cathode: H2 gas; in solution: NaOH. Reaction: 2NaCl + 2H2O -> 2NaOH + Cl2 + H2." },
      { text: "What happens at the cathode and anode during the electrolysis of water? Name the gases.", answer: "At the cathode, H+ is reduced to hydrogen gas (H2). At the anode, OH- is oxidized to oxygen gas (O2)." },
      { text: "Explain with a chemical equation how copper is deposited during electroplating.", answer: "Copper ions migrate to the cathode, gain electrons, and deposit as solid copper: Cu2+(aq) + 2e- -> Cu(s)." },
    ],
  },
  "Diagram/Graph-Based Questions": {
    Easy: [
      { text: "Draw a simple circuit diagram containing a cell, an open switch, and a bulb.", answer: "Refer to standard schematic: cell, line connecting to switch, switch gap, bulb symbol, returning to cell." },
    ],
    Medium: [
      { text: "Draw and label a diagram showing the electroplating of a copper spoon with silver.", answer: "Anode: Pure silver block; Cathode: Copper spoon; Electrolyte: Silver nitrate solution." },
    ],
    Hard: [
      { text: "Draw the graph representing current vs voltage for an ohmic conductor, and explain the physical meaning of its slope.", answer: "The graph is a straight line passing through the origin. The slope equals the conductance (1/R) of the conductor." },
    ],
  },
  "Numerical Problems": {
    Easy: [
      { text: "If a current of 2A flows through a wire for 10 seconds, calculate the total charge that passes through the cross-section.", answer: "Charge Q = Current I * time t = 2A * 10s = 20 Coulombs." },
    ],
    Medium: [
      { text: "Calculate the electrical resistance of an appliance that draws 0.5A current when connected to a 12V battery source.", answer: "Resistance R = Voltage V / Current I = 12V / 0.5A = 24 Ohms." },
    ],
    Hard: [
      { text: "A copper electroplating bath passes 5A current for 2 hours. Calculate the mass of copper deposited (ECE of copper = 0.000329 g/C).", answer: "Time t = 2 * 3600 = 7200s. Charge Q = I * t = 5 * 7200 = 36000C. Mass m = Z * Q = 0.000329 * 36000 = 11.84 grams." },
    ],
  },
};

export function generateQuestionsForAssignment(
  questionRows: QuestionRowType[],
  difficulty: string,
  topic: string
): { questions: QuestionType[]; subject: string; className: string } {
  const topicLower = topic.toLowerCase();
  let subject = "English";
  let className = "Class: 5th";

  if (
    topicLower.includes("electric") ||
    topicLower.includes("magnet") ||
    topicLower.includes("mechanic") ||
    topicLower.includes("physics") ||
    topicLower.includes("science")
  ) {
    subject = "Science";
    className = "Class: 8th";
  } else if (
    topicLower.includes("math") ||
    topicLower.includes("algebra") ||
    topicLower.includes("calculus") ||
    topicLower.includes("geometry")
  ) {
    subject = "Mathematics";
    className = "Class: 9th";
  } else if (
    topicLower.includes("history") ||
    topicLower.includes("geography") ||
    topicLower.includes("social")
  ) {
    subject = "Social Science";
    className = "Class: 7th";
  }

  let diffKey = "Medium";
  if (difficulty === "Easy") diffKey = "Easy";
  if (difficulty === "Hard") diffKey = "Hard";

  const questions: QuestionType[] = [];
  let qNum = 1;

  questionRows.forEach((row) => {
    const databaseType = QUESTION_DATABASE[row.type];
    const pool = databaseType ? databaseType[diffKey] || databaseType["Medium"] : [];

    for (let i = 0; i < row.numQuestions; i++) {
      let qText = "";
      let qAnswer = "";

      if (pool && pool.length > 0) {
        const item = pool[i % pool.length];
        qText = item.text;
        qAnswer = item.answer;
      } else {
        qText = `Explain the key concepts and applications of ${row.type} in modern studies.`;
        qAnswer = `This is a model answer for the question on ${row.type}. The student should cover the basic definition, core principles, and write down 2-3 specific real-world examples.`;
      }

      let diffTag: "Easy" | "Moderate" | "Challenging" = "Moderate";
      if (diffKey === "Easy") diffTag = "Easy";
      if (diffKey === "Hard") diffTag = "Challenging";

      questions.push({
        id: `${row.id}-${i}`,
        number: qNum++,
        difficulty: diffTag,
        text: qText,
        marks: row.marks,
        answer: qAnswer,
      });
    }
  });

  return { questions, subject, className };
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "QEL1",
    title: "Quiz on Electricity",
    file: { name: "electricity_syllabus.pdf", size: 2450122, type: "application/pdf" },
    dueDate: "21-06-2025",
    questionRows: DEFAULT_ROWS,
    additionalInfo: "Standard electricity concept check.",
    difficulty: "Medium",
    duration: "2 Hours",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "PDF Document",
    totalQuestions: 25,
    totalMarks: 60,
    createdAt: "20-06-2025",
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Medium", "Quiz on Electricity"),
  },
  {
    id: "QEL2",
    title: "Quiz on Electricity",
    file: { name: "notes.pdf", size: 345678, type: "application/pdf" },
    dueDate: "21-06-2025",
    questionRows: DEFAULT_ROWS,
    additionalInfo: "",
    difficulty: "Medium",
    duration: "2 Hours",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "PDF Document",
    totalQuestions: 25,
    totalMarks: 60,
    createdAt: "20-06-2025",
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Medium", "Quiz on Electricity"),
  },
  {
    id: "QEL3",
    title: "Quiz on Electricity",
    file: { name: "syllabus_ref.txt", size: 12455, type: "text/plain" },
    dueDate: "21-06-2025",
    questionRows: DEFAULT_ROWS,
    additionalInfo: "",
    difficulty: "Hard",
    duration: "2 Hours",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "Word Document (.docx)",
    totalQuestions: 25,
    totalMarks: 60,
    createdAt: "20-06-2025",
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Hard", "Quiz on Electricity"),
  },
  {
    id: "QEL4",
    title: "Quiz on Electricity",
    file: null,
    dueDate: "21-06-2025",
    questionRows: DEFAULT_ROWS,
    additionalInfo: "",
    difficulty: "Easy",
    duration: "1 Hour",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "Google Forms",
    totalQuestions: 25,
    totalMarks: 60,
    createdAt: "20-06-2025",
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Easy", "Quiz on Electricity"),
  },
];

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  // Core lists and states
  assignments: [],
  selectedAssignment: null,
  generatedAssignment: null,
  generatedQuestionPaper: null,
  loading: false,
  isLoading: false,
  generationStatus: "idle",
  pdfGenerationState: "idle",

  // Navigation states
  isCreating: false,
  currentStep: 1,

  // Search & Filter State
  searchQuery: "",
  filterDifficulty: "All",
  filterFormat: "All",

  // Step 1 Form State
  title: "",
  file: null,
  dueDate: "",
  questionRows: DEFAULT_ROWS,
  additionalInfo: "",

  // Step 2 Form State
  difficulty: "Medium",
  duration: "2 Hours",
  customDuration: "",
  sections: DEFAULT_SECTIONS,
  outputFormat: "PDF Document",

  errors: {},

  // Assessment initial state
  assessmentToggles: {},
  assessmentRubrics: {},
  assessmentExplanations: {},

  // Core Actions
  addAssignment: (newAssignment) => set((state) => ({
    assignments: [newAssignment, ...state.assignments],
  })),

  removeAssignment: (id) => set((state) => ({
    assignments: state.assignments.filter((asm) => asm.id !== id),
  })),

  setGeneratedPaper: (paper) => set({
    generatedQuestionPaper: paper,
    generatedAssignment: paper,
  }),

  setLoading: (loading) => set({
    loading,
    isLoading: loading,
  }),

  setGenerationStatus: (generationStatus) => set({ generationStatus }),

  fetchAssignments: async () => {
    set({ loading: true, isLoading: true });
    try {
      const response = await api.get("/assignments");
      const mapped = response.data.map(mapBackendAssignment);
      set({ assignments: mapped, loading: false, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      set({ loading: false, isLoading: false });
    }
  },

  fetchAssignmentById: async (id: string) => {
    try {
      const response = await api.get(`/assignments/${id}`);
      const mapped = mapBackendAssignment(response.data);
      set((state) => {
        const exists = state.assignments.some((asm) => asm.id === id);
        const updated = exists
          ? state.assignments.map((asm) => (asm.id === id ? mapped : asm))
          : [...state.assignments, mapped];
        return { assignments: updated };
      });
      return mapped;
    } catch (error) {
      console.error(`Failed to fetch assignment ${id}:`, error);
      return null;
    }
  },

  // Backward compatible setters
  setCreating: (isCreating) => set({ isCreating }),
  setStep: (currentStep) => set({ currentStep }),
  setTitle: (title) => set((state) => ({
    title,
    errors: { ...state.errors, title: undefined },
  })),
  setGeneratedAssignment: (generatedAssignment) => set({
    generatedAssignment,
    generatedQuestionPaper: generatedAssignment,
  }),
  setPdfGenerationState: (pdfGenerationState) => set({ pdfGenerationState }),
  setFile: (file) => set((state) => {
    const autoTitle = file && !state.title
      ? file.name.substring(0, file.name.lastIndexOf(".")) || file.name
      : state.title;
    return {
      file,
      title: autoTitle,
      errors: { ...state.errors, file: undefined, title: undefined },
    };
  }),
  setDueDate: (dueDate) => set((state) => ({
    dueDate,
    errors: { ...state.errors, dueDate: undefined },
  })),
  setAdditionalInfo: (additionalInfo) => set({ additionalInfo }),

  // Search & Filter Actions
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterDifficulty: (filterDifficulty) => set({ filterDifficulty }),
  setFilterFormat: (filterFormat) => set({ filterFormat }),
  deleteAssignment: async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      set((state) => ({
        assignments: state.assignments.filter((asm) => asm.id !== id),
      }));
      return true;
    } catch (error) {
      console.error(`Failed to delete assignment ${id}:`, error);
      return false;
    }
  },

  // Step 2 actions
  setDifficulty: (difficulty) => set({ difficulty }),
  setDuration: (duration) => set({ duration }),
  setCustomDuration: (customDuration) => set({ customDuration }),
  setSections: (sections) => set((state) => ({
    sections,
    errors: { ...state.errors, sections: undefined },
  })),
  toggleSection: (section) => set((state) => {
    const isIncluded = state.sections.includes(section);
    const updatedSections = isIncluded
      ? state.sections.filter((s) => s !== section)
      : [...state.sections, section];
    return {
      sections: updatedSections,
      errors: { ...state.errors, sections: undefined },
    };
  }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),

  // Assessment actions
  setAssessmentToggle: (questionId, enabled) => set((state) => ({
    assessmentToggles: { ...state.assessmentToggles, [questionId]: enabled }
  })),
  setAssessmentRubrics: (questionId, rubrics) => set((state) => ({
    assessmentRubrics: { ...state.assessmentRubrics, [questionId]: rubrics }
  })),
  setAssessmentExplanation: (questionId, explanation) => set((state) => ({
    assessmentExplanations: { ...state.assessmentExplanations, [questionId]: explanation }
  })),

  addQuestionRow: (type = "Multiple Choice Questions") => set((state) => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newRow: QuestionRowType = {
      id: newId,
      type,
      numQuestions: 1,
      marks: 1,
    };
    return {
      questionRows: [...state.questionRows, newRow],
      errors: { ...state.errors, questionRows: undefined },
    };
  }),

  updateQuestionRow: (id, updates) => set((state) => ({
    questionRows: state.questionRows.map((row) =>
      row.id === id ? { ...row, ...updates } : row
    ),
  })),

  deleteQuestionRow: (id) => set((state) => ({
    questionRows: state.questionRows.filter((row) => row.id !== id),
  })),

  resetForm: () => set({
    title: "",
    currentStep: 1,
    file: null,
    dueDate: "",
    questionRows: DEFAULT_ROWS,
    additionalInfo: "",

    difficulty: "Medium",
    duration: "2 Hours",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "PDF Document",

    errors: {},
    assessmentToggles: {},
    assessmentRubrics: {},
    assessmentExplanations: {},
  }),

  // Legacy validateStep action (will delegate/support react-hook-form)
  validateStep: (step) => {
    const { title, file, dueDate, questionRows, sections } = get();
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!title || !title.trim()) {
        newErrors.title = "Assignment name is required.";
        isValid = false;
      }
      if (!file) {
        newErrors.file = "Please upload a reference document or image.";
        isValid = false;
      }
      if (!dueDate) {
        newErrors.dueDate = "Due date is required.";
        isValid = false;
      }

      if (questionRows.length === 0) {
        newErrors.questionRows = "At least one question type is required.";
        isValid = false;
      }
    }

    if (step === 2) {
      if (sections.length === 0) {
        newErrors.sections = "Please select at least one section to include.";
        isValid = false;
      }
    }

    set({ errors: newErrors });
    return isValid;
  },

  createAssignment: async (onStepChange) => {
    const {
      title,
      file,
      dueDate,
      questionRows,
      additionalInfo,
      difficulty,
      duration,
      customDuration,
      sections,
      outputFormat,
    } = get();

    set({ loading: true, isLoading: true });

    try {
      const response = await api.post("/assignments", {
        title: title.trim(),
        dueDate,
        sections,
        questionRows,
        additionalInfo,
        difficulty,
        duration,
        customDuration,
        outputFormat,
        file,
      });

      const newAsm = mapBackendAssignment(response.data);

      set((state) => ({
        assignments: [newAsm, ...state.assignments],
        generatedAssignment: newAsm,
        generatedQuestionPaper: newAsm,
      }));

      onStepChange?.(0);

      return new Promise<Assignment>((resolve, reject) => {
        const s = getSocket();
        
        s.emit("join-assignment", newAsm.id);

        const handleStatusUpdate = (data: any) => {
          console.log("WebSocket received status-update:", data);
          if (data.assignmentId !== newAsm.id) return;

          if (data.status === "processing") {
            onStepChange?.(1);
            set({ generationStatus: "processing" });
          } else if (data.status === "completed") {
            onStepChange?.(2);
            set({ generationStatus: "completed" });

            api.get(`/assignments/${newAsm.id}`)
              .then((res) => {
                const finalAsm = mapBackendAssignment(res.data);
                set((state) => ({
                  assignments: state.assignments.map((asm) => (asm.id === finalAsm.id ? finalAsm : asm)),
                  generatedAssignment: finalAsm,
                  generatedQuestionPaper: finalAsm,
                  loading: false,
                  isLoading: false,
                  isCreating: false,
                }));
                
                s.off("status-update", handleStatusUpdate);
                get().resetForm();
                resolve(finalAsm);
              })
              .catch((err) => {
                s.off("status-update", handleStatusUpdate);
                set({ loading: false, isLoading: false });
                reject(err);
              });
          } else if (data.status === "failed") {
            set({ generationStatus: "failed", loading: false, isLoading: false });
            s.off("status-update", handleStatusUpdate);
            reject(new Error(data.error || "Generation failed on backend"));
          }
        };

        s.on("status-update", handleStatusUpdate);

        setTimeout(() => {
          s.off("status-update", handleStatusUpdate);
          set({ loading: false, isLoading: false });
          reject(new Error("Generation timed out."));
        }, 45000);
      });
    } catch (err: any) {
      set({ loading: false, isLoading: false });
      throw err;
    }
  },
}));
