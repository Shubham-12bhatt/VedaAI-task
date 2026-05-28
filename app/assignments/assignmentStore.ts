import { create } from "zustand";

export interface QuestionRowType {
  id: string;
  type: string;
  numQuestions: number;
  marks: number;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface QuestionType {
  id: string;
  number: number;
  difficulty: "Easy" | "Moderate" | "Challenging";
  text: string;
  marks: number;
  answer: string;
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
  createdAt: string; // Used as Assigned on date

  // Added output rendering fields
  questions?: QuestionType[];
  subject?: string;
  className?: string;
}

export interface FormErrors {
  title?: string;
  file?: string;
  dueDate?: string;
  questionRows?: string;
  sections?: string;
}

interface AssignmentStore {
  isCreating: boolean;
  currentStep: number;
  assignments: Assignment[];
  
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

  // Added states for output page
  generatedAssignment: Assignment | null;
  pdfGenerationState: 'idle' | 'generating' | 'success' | 'error';

  // AI Assessment State
  selectedQuestionId: string | null;
  assessmentToggles: Record<string, boolean>;
  assessmentRubrics: Record<string, string[]>;
  assessmentExplanations: Record<string, string>;

  // Actions
  setCreating: (isCreating: boolean) => void;
  setStep: (step: number) => void;
  setTitle: (title: string) => void;
  setFile: (file: FileData | null) => void;
  setDueDate: (dueDate: string) => void;
  setAdditionalInfo: (info: string) => void;
  setGeneratedAssignment: (asm: Assignment | null) => void;
  setPdfGenerationState: (state: 'idle' | 'generating' | 'success' | 'error') => void;
  
  // Search & Filter Actions
  setSearchQuery: (query: string) => void;
  setFilterDifficulty: (difficulty: string) => void;
  setFilterFormat: (format: string) => void;
  deleteAssignment: (id: string) => void;
  
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
  
  setSelectedQuestionId: (id: string | null) => void;
  setAssessmentToggle: (questionId: string, enabled: boolean) => void;
  setAssessmentRubrics: (questionId: string, rubrics: string[]) => void;
  setAssessmentExplanation: (questionId: string, explanation: string) => void;

  // Store Actions
  resetForm: () => void;
  validateStep: (step: number) => boolean;
  createAssignment: () => boolean;
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
    "Easy": [
      { text: "Which of the following is a good conductor of electricity?", answer: "Copper. Metals contain free electrons which allow easy flow of electric current." },
      { text: "The device used to prevent the flow of excess current in an electrical circuit is called a:", answer: "Fuse. It melts and breaks the circuit when current exceeds a safe limit." },
      { text: "Which of the following materials is an insulator?", answer: "Rubber. It does not contain free charge carriers." },
    ],
    "Medium": [
      { text: "During the electrolysis of copper sulfate, copper ions deposit on:", answer: "The cathode. Positive copper ions (Cu2+) migrate to the negative electrode (cathode)." },
      { text: "Which of these solutions will NOT conduct electricity?", answer: "Sugar solution in distilled water. It does not dissociate into free ions." },
    ],
    "Hard": [
      { text: "Which of the following conducting liquids exhibits the highest electrical conductivity?", answer: "1M Sodium Chloride solution. It has a high concentration of highly mobile ions." },
      { text: "During the electrolysis of acidified water, the ratio of hydrogen to oxygen gas evolved is:", answer: "2:1 by volume. H2O yields 2 parts H2 gas at the cathode and 1 part O2 gas at the anode." },
    ]
  },
  "Short Questions": {
    "Easy": [
      { text: "Define electroplating. Explain its main purpose.", answer: "Electroplating is the deposition of a thin metal layer on another surface using electric current. Its purpose is to prevent corrosion and improve appearance." },
      { text: "Why does a solution of copper sulfate conduct electricity?", answer: "It dissociates into free Cu2+ and SO42- ions, which act as mobile charge carriers under an electric field." },
      { text: "Mention the type of current used in electroplating and justify why.", answer: "Direct Current (DC) is used to ensure a unidirectional and uniform migration of metal cations to the cathode." },
    ],
    "Medium": [
      { text: "What is the role of a conductor in the process of electrolysis?", answer: "Conductors (electrodes) carry electric current from the external circuit into the electrolyte to drive chemical changes." },
      { text: "Describe one example of the chemical effect of electric current in daily life.", answer: "An example is gold plating cheap copper jewelry to make it look premium and prevent oxidation." },
      { text: "Explain why electric current is said to have chemical effects.", answer: "When electric current passes through an electrolyte, it induces chemical reactions like gas evolution and metal deposition." },
      { text: "What is the importance of electric current in the field of metallurgy?", answer: "It is used for electro-refining metals (like copper) and electro-extraction of highly reactive metals (like aluminum)." },
    ],
    "Hard": [
      { text: "How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction.", answer: "Brine (aq NaCl) is electrolyzed in the Chloralkali process. At anode: Cl2 gas; at cathode: H2 gas; in solution: NaOH. Reaction: 2NaCl + 2H2O -> 2NaOH + Cl2 + H2." },
      { text: "What happens at the cathode and anode during the electrolysis of water? Name the gases.", answer: "At the cathode, H+ is reduced to hydrogen gas (H2). At the anode, OH- is oxidized to oxygen gas (O2)." },
      { text: "Explain with a chemical equation how copper is deposited during electroplating.", answer: "Copper ions migrate to the cathode, gain electrons, and deposit as solid copper: Cu2+(aq) + 2e- -> Cu(s)." },
    ]
  },
  "Diagram/Graph-Based Questions": {
    "Easy": [
      { text: "Draw a simple circuit diagram containing a cell, an open switch, and a bulb.", answer: "Refer to standard schematic: cell, line connecting to switch, switch gap, bulb symbol, returning to cell." },
    ],
    "Medium": [
      { text: "Draw and label a diagram showing the electroplating of a copper spoon with silver.", answer: "Anode: Pure silver block; Cathode: Copper spoon; Electrolyte: Silver nitrate solution." },
    ],
    "Hard": [
      { text: "Draw the graph representing current vs voltage for an ohmic conductor, and explain the physical meaning of its slope.", answer: "The graph is a straight line passing through the origin. The slope equals the conductance (1/R) of the conductor." },
    ]
  },
  "Numerical Problems": {
    "Easy": [
      { text: "If a current of 2A flows through a wire for 10 seconds, calculate the total charge that passes through the cross-section.", answer: "Charge Q = Current I * time t = 2A * 10s = 20 Coulombs." },
    ],
    "Medium": [
      { text: "Calculate the electrical resistance of an appliance that draws 0.5A current when connected to a 12V battery source.", answer: "Resistance R = Voltage V / Current I = 12V / 0.5A = 24 Ohms." },
    ],
    "Hard": [
      { text: "A copper electroplating bath passes 5A current for 2 hours. Calculate the mass of copper deposited (ECE of copper = 0.000329 g/C).", answer: "Time t = 2 * 3600 = 7200s. Charge Q = I * t = 5 * 7200 = 36000C. Mass m = Z * Q = 0.000329 * 36000 = 11.84 grams." },
    ]
  }
};

export function generateQuestionsForAssignment(
  questionRows: QuestionRowType[],
  difficulty: string,
  topic: string
): { questions: QuestionType[]; subject: string; className: string } {
  const topicLower = topic.toLowerCase();
  let subject = "English";
  let className = "Class: 5th";
  
  if (topicLower.includes("electric") || topicLower.includes("magnet") || topicLower.includes("mechanic") || topicLower.includes("physics") || topicLower.includes("science") || topicLower.includes("photosynthesis")) {
    subject = "Science";
    className = "Class: 8th";
  } else if (topicLower.includes("math") || topicLower.includes("algebra") || topicLower.includes("calculus") || topicLower.includes("geometry")) {
    subject = "Mathematics";
    className = "Class: 9th";
  } else if (topicLower.includes("history") || topicLower.includes("geography") || topicLower.includes("social")) {
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
        answer: qAnswer
      });
    }
  });

  return { questions, subject, className };
}

// Pre-populated mock assignments matching the Figma dashboard layout
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
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Medium", "Quiz on Electricity")
  },
  {
    id: "QEL2",
    title: "Quiz on Electricity",
    file: { name: "electricity_guide.png", size: 1048576, type: "image/png" },
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
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Medium", "Quiz on Electricity")
  },
  {
    id: "QEL3",
    title: "Quiz on Electricity",
    file: { name: "notes.pdf", size: 345678, type: "application/pdf" },
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
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Hard", "Quiz on Electricity")
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
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Easy", "Quiz on Electricity")
  },
  {
    id: "QMG1",
    title: "Quiz on Magnetism",
    file: null,
    dueDate: "22-06-2025",
    questionRows: DEFAULT_ROWS,
    additionalInfo: "Covering poles and induction fields.",
    difficulty: "Medium",
    duration: "2 Hours",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "PDF Document",
    totalQuestions: 20,
    totalMarks: 50,
    createdAt: "18-06-2025",
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Medium", "Quiz on Magnetism")
  },
  {
    id: "QMC1",
    title: "Quiz on Mechanics",
    file: null,
    dueDate: "25-06-2025",
    questionRows: DEFAULT_ROWS,
    additionalInfo: "Equations of motion, friction force.",
    difficulty: "Hard",
    duration: "3 Hours",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "PDF Document",
    totalQuestions: 30,
    totalMarks: 80,
    createdAt: "15-06-2025",
    ...generateQuestionsForAssignment(DEFAULT_ROWS, "Hard", "Quiz on Mechanics")
  },
];

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  isCreating: false,
  currentStep: 1,
  assignments: MOCK_ASSIGNMENTS, // Default pre-populated list

  // Search & Filter State
  searchQuery: "",
  filterDifficulty: "All",
  filterFormat: "All",

  // Added states for output page
  generatedAssignment: null,
  pdfGenerationState: 'idle',

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

  // AI Assessment State Initial
  selectedQuestionId: null,
  assessmentToggles: {},
  assessmentRubrics: {},
  assessmentExplanations: {},

  setCreating: (isCreating) => set({ isCreating }),
  setStep: (currentStep) => set({ currentStep }),
  setTitle: (title) => set((state) => ({ 
    title, 
    errors: { ...state.errors, title: undefined } 
  })),
  setGeneratedAssignment: (generatedAssignment) => set({ generatedAssignment }),
  setPdfGenerationState: (pdfGenerationState) => set({ pdfGenerationState }),
  
  setSelectedQuestionId: (selectedQuestionId) => set({ selectedQuestionId }),
  setAssessmentToggle: (questionId, enabled) => set((state) => ({
    assessmentToggles: { ...state.assessmentToggles, [questionId]: enabled }
  })),
  setAssessmentRubrics: (questionId, rubrics) => set((state) => ({
    assessmentRubrics: { ...state.assessmentRubrics, [questionId]: rubrics }
  })),
  setAssessmentExplanation: (questionId, explanation) => set((state) => ({
    assessmentExplanations: { ...state.assessmentExplanations, [questionId]: explanation }
  })),

  setFile: (file) => set((state) => {
    // Auto prefill title from file name if it's currently empty
    const autoTitle = file && !state.title 
      ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name 
      : state.title;
    return { 
      file, 
      title: autoTitle,
      errors: { ...state.errors, file: undefined, title: undefined } 
    };
  }),
  setDueDate: (dueDate) => set((state) => ({ 
    dueDate, 
    errors: { ...state.errors, dueDate: undefined } 
  })),
  setAdditionalInfo: (additionalInfo) => set({ additionalInfo }),

  // Search & Filter Actions
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterDifficulty: (filterDifficulty) => set({ filterDifficulty }),
  setFilterFormat: (filterFormat) => set({ filterFormat }),
  deleteAssignment: (id) => set((state) => ({
    assignments: state.assignments.filter((asm) => asm.id !== id),
  })),

  // Step 2 Setters
  setDifficulty: (difficulty) => set({ difficulty }),
  setDuration: (duration) => set({ duration }),
  setCustomDuration: (customDuration) => set({ customDuration }),
  setSections: (sections) => set((state) => ({ 
    sections,
    errors: { ...state.errors, sections: undefined }
  })),
  toggleSection: (section) => set((state) => {
    const isIncluded = state.sections.includes(section);
    const updatedSections = isIncluded
      ? state.sections.filter((s) => s !== section)
      : [...state.sections, section];
    return {
      sections: updatedSections,
      errors: { ...state.errors, sections: undefined }
    };
  }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),

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
      errors: { ...state.errors, questionRows: undefined }
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
    
    // Reset Step 2 fields
    difficulty: "Medium",
    duration: "2 Hours",
    customDuration: "",
    sections: DEFAULT_SECTIONS,
    outputFormat: "PDF Document",
    
    errors: {},

    // Reset AI Assessment State
    selectedQuestionId: null,
    assessmentToggles: {},
    assessmentRubrics: {},
    assessmentExplanations: {},
  }),

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
      } else {
        // Validate due date format DD-MM-YYYY
        const datePattern = /^\d{2}-\d{2}-\d{4}$/;
        if (!datePattern.test(dueDate)) {
          newErrors.dueDate = "Date must be in DD-MM-YYYY format.";
          isValid = false;
        } else {
          // Check if it's a valid date
          const [day, month, year] = dueDate.split("-").map(Number);
          const dateObj = new Date(year, month - 1, day);
          if (
            dateObj.getFullYear() !== year ||
            dateObj.getMonth() !== month - 1 ||
            dateObj.getDate() !== day
          ) {
            newErrors.dueDate = "Please enter a valid calendar date.";
            isValid = false;
          }
        }
      }

      if (questionRows.length === 0) {
        newErrors.questionRows = "At least one question type is required.";
        isValid = false;
      } else {
        const hasInvalidRow = questionRows.some(
          (row) => row.numQuestions < 1 || row.marks < 1
        );
        if (hasInvalidRow) {
          newErrors.questionRows = "Questions and Marks must be at least 1.";
          isValid = false;
        }
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

  createAssignment: () => {
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
      assignments 
    } = get();
    
    // Calculate totals
    const totalQuestions = questionRows.reduce((sum, row) => sum + row.numQuestions, 0);
    const totalMarks = questionRows.reduce((sum, row) => sum + (row.numQuestions * row.marks), 0);

    const assignmentTitle = title.trim() || (file ? file.name.substring(0, file.name.lastIndexOf('.')) || file.name : "New Assignment");
    const { questions, subject, className } = generateQuestionsForAssignment(questionRows, difficulty, assignmentTitle);

    const newAssignment: Assignment = {
      id: "Q" + Math.random().toString(36).substring(2, 6).toUpperCase(),
      title: assignmentTitle,
      file,
      dueDate,
      questionRows,
      additionalInfo,
      
      // Step 2 fields
      difficulty,
      duration,
      customDuration,
      sections,
      outputFormat,
      
      totalQuestions,
      totalMarks,
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "-"),

      questions,
      subject,
      className
    };

    set({
      assignments: [newAssignment, ...assignments],
      generatedAssignment: newAssignment, // Transition directly to output view
      isCreating: false,
    });
    
    get().resetForm();
    return true;
  },
}));
