import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { conditionalStepValidation } from "./constant";
import { userController, } from "./user.controller";
import { candidateIdentityVerificationController } from "../candidate/candidate.controller";
import { candidateStepValidation } from "../candidate/candidate.constant";
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
router.get("/single-user/:id", authMiddleware(role.admin), userController.singleUser);
router.post("/identity-verification", authMiddleware(role.employer), conditionalStepValidation, userController.IdentityVerification)
router.post("/employer-identity-verification", authMiddleware(role.candidate), candidateStepValidation, candidateIdentityVerificationController.candidateIdentityVerification)

router.get("/account-management", authMiddleware(role.admin), userController.employerAccountManagement)
router.get("/approve-employer", authMiddleware(role.admin), userController.approveEmployer)

router.get('/top-companies',)


export const UserRoutes = router;
