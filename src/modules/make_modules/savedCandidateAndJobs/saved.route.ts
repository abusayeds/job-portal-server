import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { savedCandidateAndJobsController } from "./saved.controller";


const router = express.Router();
router.post("/:id", authMiddleware(role.candidate, role.employer), savedCandidateAndJobsController.savedCandidateAndJobs);
router.get("/my-favorites", authMiddleware(role.candidate, role.employer), savedCandidateAndJobsController.myFavorites);
export const savedJobRoute = router;