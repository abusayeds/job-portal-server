import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import {
  createRefund,
  getAllRefund,
  updateRefund,
} from "./refund.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.admin), createRefund);
router.get("/", getAllRefund);
router.post("/update", authMiddleware(role.admin), updateRefund);

export const RefundRoutes = router;
