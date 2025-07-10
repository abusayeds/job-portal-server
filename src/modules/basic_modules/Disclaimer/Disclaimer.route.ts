import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { createDisclaimer, getAllDisclaimer, updateDisclaimer } from "./Disclaimer.controller";


const router = express.Router();
router.post("/create", authMiddleware(role.admin), createDisclaimer);
router.get("/", getAllDisclaimer);
router.post("/update", authMiddleware(role.admin), updateDisclaimer);

export const disclaimerRoutes = router;
