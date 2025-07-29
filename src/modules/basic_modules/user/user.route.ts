import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import zodValidation from "../../../middlewares/zodValidationHandler";
import { role } from "../../../utils/role";
import { candidateStepValidation } from "../candidate/candidate.constant";
import { candidateIdentityVerificationController } from "../candidate/candidate.controller";
import { candidateValidation } from "../candidate/candidate.validation";
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


router.get("/all-user", authMiddleware(role.admin, role.employer), userController.getAllUsers);
router.get("/single-user/:id", authMiddleware(role.admin), userController.singleUser);
router.post("/identity-verification", authMiddleware(role.employer), conditionalStepValidation, userController.IdentityVerification)
router.post("/candidate-identity-verification", authMiddleware(role.candidate), candidateStepValidation, candidateIdentityVerificationController.candidateIdentityVerification)

router.post('/cv-update', authMiddleware(role.candidate), userController.candidateCvUpdate)
router.post("/job-alert", authMiddleware(role.candidate), zodValidation(candidateValidation.candidateJobAlertValidation), candidateIdentityVerificationController.candidateJobAlert);

router.post("/handle-status/:userId", authMiddleware(role.admin), userController.handleStatus);
// router.post("/deactive/:userId", authMiddleware(role.admin), userController.userDeactive);
// router.post("/approve/:userId", authMiddleware(role.admin), userController.userAppprove);
// router.post("/reject/:userId", authMiddleware(role.admin), userController.userReject);

router.get("/account-management", authMiddleware(role.admin), userController.employerAccountManagement)
router.get("/approve-employer", authMiddleware(role.admin), userController.approveEmployer)

router.post("/access-employe", authMiddleware(role.employer), userController.accessEmploye)

router.get('/companies', userController.getCompanies)
router.get('/seekers', userController.getSeekers)
router.get('/seeker/:id', userController.getSeekerById)
router.get('/employers', userController.getEmployers)
router.get('/top-companies', userController.topCompanies)
router.get('/statistics', userController.statistics)
router.get('/single-employer/:id', userController.getEmployerById)
router.post('/send-mail', userController.sendEmailToSupport)


export const UserRoutes = router;
