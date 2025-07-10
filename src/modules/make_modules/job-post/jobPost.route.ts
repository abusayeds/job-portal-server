import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { jobController } from "./jobPost.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.employer), jobController.createJob);
router.get("/my-jobs", authMiddleware(role.employer, role.candidate, role.admin), jobController.myJobs);
router.post("/single", authMiddleware(role.employer, role.candidate, role.admin),);


export const jobRoute = router;