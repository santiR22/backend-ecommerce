import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controllers.js";
import { authJwt, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authJwt, isAdmin, createProduct);
router.put("/:id", authJwt, isAdmin, updateProduct);
router.delete("/:id", authJwt, isAdmin, deleteProduct);

export default router;
