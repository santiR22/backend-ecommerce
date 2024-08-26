import express from "express";
import { authJwt, isAdmin } from "../middlewares/authMiddleware.js";
import {
  create_category,
  delete_category,
  get_categories,
  get_category,
  update_category,
} from "../controllers/prodCategory.controllers.js";

const router = express.Router();

router.get("/", get_categories);
router.post("/", authJwt, isAdmin, create_category);
router.put("/:id", authJwt, isAdmin, update_category);
router.delete("/:id", authJwt, isAdmin, delete_category);
router.get("/:id", get_category);

export default router;
