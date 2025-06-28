import express from "express";
import uploadRouter from "../fileUpload/route";
import { AboutRoutes } from "../modules/basic_modules/About/About.route";
import { NotificationRoutes } from "../modules/basic_modules/notifications/notification.route";
import { PrivacyRoutes } from "../modules/basic_modules/privacy/Privacy.route";
import { TermsRoutes } from "../modules/basic_modules/Terms/Terms.route";
import { UserRoutes } from "../modules/basic_modules/user/user.route";
import { jobRoute } from "../modules/make_modules/job-post/jobPost.route";
import { purchaseRoute } from "../modules/make_modules/purchasePlan/purchasePlan.route";
import { SubscriptionRoute } from "../modules/make_modules/subscription/subscription.route";


const router = express.Router();

router.use("/api/v1/user", UserRoutes);
router.use("/api/v1/terms", TermsRoutes);
router.use("/api/v1/about", AboutRoutes);
router.use("/api/v1/privacy", PrivacyRoutes);
router.use("/api/v1/notification", NotificationRoutes);

router.use('/api/v1/uploded', uploadRouter)

router.use('/api/v1/subscription', SubscriptionRoute);

router.use("/api/v1/plan", purchaseRoute);

router.use("/api/v1/job", jobRoute);



export default router;
