import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import {
  createPrivacy,
  getAllPrivacy,
  updatePrivacy,
} from "./Privacy.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.admin), createPrivacy);
router.get("/", getAllPrivacy);
router.post("/update", authMiddleware(role.admin), updatePrivacy);

export const PrivacyRoutes = router;
