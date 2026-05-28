import { Router } from "express";
import { assignmentController } from "../controllers/assignmentController";

const router = Router();

// Retrieve all assignments
router.get("/", assignmentController.getAssignments);

// Retrieve a single assignment details
router.get("/:id", assignmentController.getAssignmentById);

// Submit a new assignment for creation and generation
router.post("/", assignmentController.createAssignment);

// Delete an assignment
router.delete("/:id", assignmentController.deleteAssignment);

export default router;
