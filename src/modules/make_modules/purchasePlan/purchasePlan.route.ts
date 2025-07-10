import express from "express";

import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { purchasePlanController } from "./purchasePlan.controller";

const router = express.Router();
router.post("/purchase/:productId", authMiddleware(role.employer), purchasePlanController.purchasePlan);
router.post("/auto-renewal/:subscriptionId", authMiddleware(role.employer), purchasePlanController.autoRenewal);

router.get("/latest-invoice", authMiddleware(role.employer), purchasePlanController.latestInvoice)

router.get("/my-plan", authMiddleware(role.employer), purchasePlanController.myPlan)
export const purchaseRoute = router;