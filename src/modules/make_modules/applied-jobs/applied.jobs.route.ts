import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { appliedJobController } from "./applied.jobs.controller";

const router = express.Router();
router.post("/apply/:jobId", authMiddleware(role.candidate), appliedJobController.createAppliedJob);

export const appliedJobRoute = router;