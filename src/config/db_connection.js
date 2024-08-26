import mongoose from "mongoose";
import { MONGODB_URI } from "../config.js";

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then((db) => console.log("DB is connected"))
  .catch((error) => console.log(error.message));
