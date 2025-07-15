import express from "express";
import { getMyNotification } from "./notification.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();

router.get("/", authMiddleware(role.admin, role.candidate, role.employe, role.employer), getMyNotification);

export const NotificationRoutes = router;
