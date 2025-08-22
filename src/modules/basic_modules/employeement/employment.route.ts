import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { employmentController } from "./employment.comtroller";

const router = express.Router();
// router.post("/add-employment", authMiddleware(role.candidate));
router.post("/record", authMiddleware(role.candidate), employmentController.addRecord);
router.delete("/record", authMiddleware(role.candidate), employmentController.deleteRecord);

export const employmentRoutes = router;
