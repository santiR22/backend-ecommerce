import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: "3d" });
};
