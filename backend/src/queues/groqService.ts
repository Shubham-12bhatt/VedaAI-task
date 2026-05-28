import { IAssignment } from "../models/Assignment";
import { generateQuestionsForAssignment } from "./questionGenerator";

export async function generateQuestionsWithAI(assignment: IAssignment): Promise<{
  questions: any[];
  subject: string;
  className: string;
}> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("GROQ_API_KEY is not defined in .env. Falling back to static question generator.");
    return generateQuestionsForAssignment(
      assignment.questionTypes as any,
      assignment.difficulty || "Medium",
      assignment.title
    );
  }

  const systemPrompt = `You are an expert academic evaluator. Your task is to generate a structured exam/question paper in JSON format based on the user's requirements.

You MUST respond with a valid JSON object matching the following structure:
{
  "subject": string, // E.g., "Science", "Mathematics", "Social Science", "English", depending on the topic/title
  "className": string, // E.g., "Class: 8th", "Class: 9th", depending on the level/topic
  "questions": Array<{
    "id": string, // The ID from the corresponding question type configuration, suffixed with index (e.g. "typeId-0", "typeId-1")
    "number": number, // Sequential question number starting from 1
    "difficulty": "Easy" | "Moderate" | "Challenging", // Match the difficulty key: Easy -> Easy, Medium -> Moderate, Hard -> Challenging
    "text": string, // The question text. If it is Multiple Choice, include options (A, B, C, D) inside the text or format
    "marks": number, // Must match the marks specified for this question type
    "answer": string // The detailed model answer/key or criteria for evaluation
  }>
}

Constraints:
1. You MUST generate exactly the number of questions specified for each question type.
2. For each question, the "marks" MUST match the specified marks for that question type.
3. The response MUST be pure JSON only. Do not wrap in markdown code blocks like \`\`\`json. Just output the JSON.
4. If the user provides additional instructions, you MUST follow them.
`;

  const userPrompt = `Generate a question paper with the following configuration:
- Title/Topic: "${assignment.title}"
- Overall Difficulty: "${assignment.difficulty}"
- Additional Guidelines: "${assignment.additionalInfo || 'None'}"
- Requested Sections/Question Types:
${assignment.questionTypes.map((t: any) => `- Type: "${t.type}", Number of Questions: ${t.numQuestions}, Marks per Question: ${t.marks}, Type ID: "${t.id}"`).join("\n")}
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response content from Groq API");
    }

    const parsed = JSON.parse(content);
    
    // Validate schema basic requirements
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response format: 'questions' array is missing");
    }

    return {
      questions: parsed.questions,
      subject: parsed.subject || "Science",
      className: parsed.className || "Class: 8th",
    };
  } catch (error) {
    console.error("Failed to generate questions using Groq API. Falling back to static question generator:", error);
    return generateQuestionsForAssignment(
      assignment.questionTypes as any,
      assignment.difficulty || "Medium",
      assignment.title
    );
  }
}
