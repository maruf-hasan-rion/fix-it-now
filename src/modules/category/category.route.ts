import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { CategoryController } from "./category.controller";
import { Role } from "../../../generated/prisma/enums";
import { CategoryValidation } from "./category.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get("/", CategoryController.getAllCategories);
// router.get("/:id", CategoryController.getSingleCategory);

// admin routes
router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(CategoryValidation.createCategorySchema),
  CategoryController.createCategory,
);
// router.patch(
//   "/:id",
//   auth(Role.ADMIN),
//   validateRequest(CategoryValidation.updateCategorySchema),
//   CategoryController.updateCategory,
// );
// router.delete("/:id", auth(Role.ADMIN), CategoryController.deleteCategory);

export const categoryRoutes = router;
