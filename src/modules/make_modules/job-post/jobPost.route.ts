import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { jobController } from "./jobPost.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.employer), jobController.createJob);
router.get("/employer-all-jobs", authMiddleware(role.employer, role.candidate, role.admin), jobController.myJobs);
router.get("/single/:jobId", authMiddleware(role.employer, role.candidate, role.admin), jobController.singleJobs);

router.get("/all", authMiddleware(role.candidate), jobController.getAllJobs);

export const jobRoute = router;