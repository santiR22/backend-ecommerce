import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { PORT } from "./config.js";
import cookieParser from "cookie-parser";
import authRouter from "../src/routes/auth.routes.js";
import producRouter from "../src/routes/product.routes.js";
import blogRouter from "../src/routes/blog.routes.js";
import categoryRouter from "../src/routes/prodCategory.routes.js";
import blogCategoryRouter from "../src/routes/blogCategory.routes.js";
import { errorHandler, notFound } from "./middlewares/errorHanlder.js";

const app = express();

//Settings...
app.set("port", PORT || 4000);
app.set("json spaces", 4);

//Middlewares...
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes...
app.use("/api/user", authRouter);
app.use("/api/product", producRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blog-category", blogCategoryRouter);

// Error handler (must go to the end...)
app.use(notFound);
app.use(errorHandler);

export default app;
