import express from "express";

import { createAbout, getAllAbout, updateAbout } from "./About.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();
router.post("/create", authMiddleware(role.admin), createAbout);
router.get("/", getAllAbout);
router.post("/update", authMiddleware(role.admin), updateAbout);

export const AboutRoutes = router;
