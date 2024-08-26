import express from "express";
import {
  create_blog,
  delete_blog,
  dislike_blog,
  get_blog,
  get_blogs,
  like_blog,
  update_blog,
} from "../controllers/blog.controllers.js";
import { authJwt, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", get_blogs);
router.post("/", authJwt, isAdmin, create_blog);
router.put("/likes", authJwt, isAdmin, like_blog);
router.put("/dislikes", authJwt, isAdmin, dislike_blog);
router.get("/:id", get_blog);
router.put("/:id", authJwt, isAdmin, update_blog);
router.delete("/:id", authJwt, isAdmin, delete_blog);

export default router;
