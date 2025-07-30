import express from "express";
import { getMyNotification, getUnreadNotificationCount } from "./notification.controller";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";

const router = express.Router();

router.get("/", authMiddleware(role.admin, role.candidate, role.employe, role.employer), getMyNotification);
router.get("/count", authMiddleware(role.admin, role.candidate, role.employe, role.employer), getUnreadNotificationCount);

export const NotificationRoutes = router;
