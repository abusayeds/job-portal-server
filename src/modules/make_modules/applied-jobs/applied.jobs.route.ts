import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { appliedJobController } from "./applied.jobs.controller";

const router = express.Router();
router.post("/apply/:jobId", authMiddleware(role.candidate), appliedJobController.createAppliedJob);
router.get("/my-jobs", authMiddleware(role.candidate, role.employer), appliedJobController.getMyAppliedJobs);

router.get("/overview", authMiddleware(role.employer, role.candidate), appliedJobController.overview);
export const appliedJobRoute = router;