import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { jobController } from "./jobPost.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.employer), jobController.createJob);
router.get("/single/:jobId", jobController.singleJobs);
router.get("/all", jobController.getAllJobs);
router.get("/view-applications/:jobId", authMiddleware(role.employer, role.employe), jobController.viewApplications);
router.get("/single-apply/:appliedId", authMiddleware(role.candidate, role.employer, role.employe), jobController.singleApplyJob);

router.get("/my-job-alerts", authMiddleware(role.candidate), jobController.candidateJobAlert);

export const jobRoute = router;