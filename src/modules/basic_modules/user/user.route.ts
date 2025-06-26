import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { conditionalStepValidation } from "./constant";
import { userController, } from "./user.controller";
const router = express.Router();
router.post("/register", userController.registerUser,);
router.post("/verify-otp", userController.verifyOTP);
router.post("/login", userController.loginUser);
router.post("/forget-password", userController.forgotPassword);
router.post("/verify-forget-otp", userController.verifyForgotPasswordOTP);
router.post("/resend", userController.resendOTP);
router.post("/reset-password", userController.resetPassword);
router.post("/change-password", userController.changePassword);
router.post("/update", userController.updateUser);
router.get("/my-profile",
  authMiddleware(role.admin, role.candidate, role.employer, role.employe),
  userController.myProfile);
router.get("/all-user", authMiddleware(role.admin), userController.getAllUsers);
router.post("/active/:userId", authMiddleware(role.admin), userController.userActive);
router.post("/deactive/:userId", authMiddleware(role.admin), userController.userDeactive);

router.post("/identity-verification", authMiddleware(role.employer), conditionalStepValidation, userController.IdentityVerification)

export const UserRoutes = router;
