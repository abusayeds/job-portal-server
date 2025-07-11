import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { adminEarningController } from "./adminEarning.controller";


const router = express.Router();
router.get("/earning/:year", authMiddleware(role.admin), adminEarningController.adminEarning);
router.get("/dashboard", authMiddleware(role.admin), adminEarningController.showEarning);
router.get('/earning-history', authMiddleware(role.admin), adminEarningController.earningList)

export const adminEarningRoute = router;