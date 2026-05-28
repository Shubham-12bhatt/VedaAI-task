import { api } from "@/lib/api";
import { Assignment } from "@/types/assignment";

export const assignmentService = {
  /**
   * Fetches all assessments/assignments from the backend.
   */
  getAssignments: async (): Promise<Assignment[]> => {
    const response = await api.get<Assignment[]>("/assignments");
    return response.data;
  },

  /**
   * Submits new assignment creation data.
   */
  createAssignment: async (data: Partial<Assignment>): Promise<Assignment> => {
    const response = await api.post<Assignment>("/assignments", data);
    return response.data;
  },

  /**
   * Triggers the AI generation sequence for a specific question paper.
   */
  generatePaper: async (assignmentId: string): Promise<Assignment> => {
    const response = await api.post<Assignment>(`/assignments/${assignmentId}/generate`);
    return response.data;
  },
};
export default assignmentService;
