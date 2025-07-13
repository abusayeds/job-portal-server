import express from "express";
import uploadRouter from "../fileUpload/route";
import { AboutRoutes } from "../modules/basic_modules/About/About.route";
import { disclaimerRoutes } from "../modules/basic_modules/Disclaimer/Disclaimer.route";
import { NotificationRoutes } from "../modules/basic_modules/notifications/notification.route";
import { PrivacyRoutes } from "../modules/basic_modules/privacy/Privacy.route";
import { TermsRoutes } from "../modules/basic_modules/Terms/Terms.route";
import { UserRoutes } from "../modules/basic_modules/user/user.route";
import { adminEarningRoute } from "../modules/make_modules/adminEarning/adminEarning.route";
import { appliedJobRoute } from "../modules/make_modules/applied-jobs/applied.jobs.route";
import { categoryRoute } from "../modules/make_modules/category/category.route";
import { jobRoute } from "../modules/make_modules/job-post/jobPost.route";
import { purchaseRoute } from "../modules/make_modules/purchasePlan/purchasePlan.route";
import { SubscriptionRoute } from "../modules/make_modules/subscription/subscription.route";


const router = express.Router();

router.use("/api/v1/user", UserRoutes);
router.use("/api/v1/terms", TermsRoutes);
router.use("/api/v1/about", AboutRoutes);
router.use("/api/v1/disclaimer", disclaimerRoutes);
router.use("/api/v1/privacy", PrivacyRoutes);
router.use("/api/v1/notification", NotificationRoutes);

router.use('/api/v1/uploded', uploadRouter)

router.use('/api/v1/subscription', SubscriptionRoute);

router.use("/api/v1/plan", purchaseRoute);

router.use("/api/v1/job", jobRoute);

router.use("/api/v1/category", categoryRoute);
router.use("/api/v1/admin", adminEarningRoute);

router.use("/api/v1/job", appliedJobRoute);



export default router;
