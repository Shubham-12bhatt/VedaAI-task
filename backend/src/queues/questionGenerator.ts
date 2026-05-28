import { IQuestion, IQuestionType } from "../models/Assignment";

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
  questionTypes: IQuestionType[],
  difficulty: string,
  topic: string
): { questions: IQuestion[]; subject: string; className: string } {
  const topicLower = topic.toLowerCase();
  let subject = "English";
  let className = "Class: 5th";

  if (
    topicLower.includes("electric") ||
    topicLower.includes("magnet") ||
    topicLower.includes("mechanic") ||
    topicLower.includes("physics") ||
    topicLower.includes("science") ||
    topicLower.includes("photosynthesis")
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

  const questions: IQuestion[] = [];
  let qNum = 1;

  questionTypes.forEach((row) => {
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
