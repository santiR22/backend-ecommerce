import express from "express";
import {
  blockUser,
  createUser,
  deleteUser,
  forgot_password_token,
  getUser,
  getUsers,
  handleRefreshToken,
  login,
  logout,
  reset_password,
  unblockUser,
  updatePassword,
  updateUser,
} from "../controllers/user.controllers.js";
import { authJwt, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.post("/forgot-password-token", forgot_password_token);

router.get("/", getUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authJwt, isAdmin, getUser);

router.put("/edit-user", authJwt, updateUser);
router.put("/block-user/:id", authJwt, isAdmin, blockUser);
router.put("/unblock-user/:id", authJwt, isAdmin, unblockUser);
router.put("/password", authJwt, updatePassword);
router.put("/reset-password/:token", reset_password);

router.delete("/:id", deleteUser);

export default router;
