import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { subscriptionController } from "./subscription.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.admin), subscriptionController.createSubscription);
router.post("/update/:subs_id", authMiddleware(role.admin), subscriptionController.updateSubscription);
router.get("/", authMiddleware(role.admin, role.employer), subscriptionController.allSubscription);




export const SubscriptionRoute = router; 
