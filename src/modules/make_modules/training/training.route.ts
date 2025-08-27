import express from "express";
import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { trainingController } from "./training.controller";

const router = express.Router();

router.post("/create", authMiddleware(role.employer, role.employe), trainingController.createtraining);
router.get("/all", trainingController.getAlltrainings);
router.get("/my-training", authMiddleware(role.employer), trainingController.getEmployeetrainings);
router.get("/single/:id", trainingController.getSingletraining);
router.patch("/:id", trainingController.updatetraining);
router.delete("/:id", trainingController.deletetraining);
router.get("/applied-traning")

router.post('/ragistration', authMiddleware(role.candidate), trainingController.createTraningRagistration)
router.get('/ragistration-list', authMiddleware(role.employer), trainingController.traningRagistrationList)
router.get('/specific/:trainingId', authMiddleware(role.employer), trainingController.traningSpecificList)
export const trainingRoutes = router;