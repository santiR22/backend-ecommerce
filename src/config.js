import dotenv from "dotenv";

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT || 4000;
export const SECRET = process.env.SECRET_KEY;
export const MAIL_PASSWORD = process.env.MP;
export const MAIL_ID = process.env.MAIL_ID;
