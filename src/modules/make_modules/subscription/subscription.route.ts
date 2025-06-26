import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { subscriptionController } from "./subscription.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.admin), subscriptionController.createSubscription);


export const SubscriptionRoute = router;
