import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { jobController } from "./jobPost.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.employer, role.employe), jobController.createJob);
router.put("/:id", authMiddleware(role.employer, role.employe), jobController.updateJob);
router.get("/single/:jobId", jobController.singleJobs);
router.get("/all", jobController.getAllJobs);
router.get("/view-applications/:jobId", authMiddleware(role.employer, role.employe), jobController.viewApplications);
router.get("/single-apply/:appliedId", authMiddleware(role.candidate, role.employer, role.employe), jobController.singleApplyJob);

router.get("/all/:employerId", jobController.getAllJobs);
router.get("/my-job-alerts", authMiddleware(role.candidate), jobController.candidateJobAlert);
router.get('/related-jobs/:jobId', jobController.relatedJobs)
router.delete('/delete-job/:jobId', jobController.deleteJob)
export const jobRoute = router;