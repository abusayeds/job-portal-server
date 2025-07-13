import express from "express";


import { authMiddleware } from "../../../middlewares/auth";
import { role } from "../../../utils/role";
import { categoryController } from "./category.controller";

const router = express.Router();

// Routes for Category operations
router.post("/create", authMiddleware(role.admin), categoryController.createCategory);
router.post("/update/:id", authMiddleware(role.admin), categoryController.updateCategory);
router.delete("/delete/:id", authMiddleware(role.admin), categoryController.deleteCategory);
router.get("/all", categoryController.getAllCategories);
router.get("/single/:id", categoryController.getSingleCategory);

router.get("/popular", categoryController.getPopularCategory)



export const categoryRoute = router;
