import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { createTerms, getAllTerms, updateTerms } from "./Terms.controller";

const router = express.Router();
router.post("/create", authMiddleware(role.admin), createTerms);
router.get("/", getAllTerms);
router.post("/update", authMiddleware(role.admin), updateTerms);

export const TermsRoutes = router;
