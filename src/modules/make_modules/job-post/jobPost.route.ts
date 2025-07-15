import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { jobController } from "./jobPost.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.employer), jobController.createJob);
router.get("/single/:jobId", jobController.singleJobs);
router.get("/all", jobController.getAllJobs);

export const jobRoute = router;