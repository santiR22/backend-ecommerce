import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";

export const generateJwt = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: "1d" });
};
