import { Router } from "express";
import {
  getActiveDepartments,
  getActiveProjects,
  getActiveEmployees,
  getActiveVehicleTypes,
  getActiveMemberCounts,
  createVisitorRecord,
} from "../controllers/visitor.controller.js";

const router = Router();

// Lookup endpoints for active options
router.get("/departments", getActiveDepartments);
router.get("/projects", getActiveProjects);
router.get("/employees", getActiveEmployees);
router.get("/vehicle-types", getActiveVehicleTypes);
router.get("/member-counts", getActiveMemberCounts);

// Visitor registration endpoint
router.post("/", createVisitorRecord);

export default router;