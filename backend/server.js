import express from "express";
import connectDb from "./config/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
import cors from "cors";
import newsRouter from "./router/newsRouter.js";
import commentsRouter from "./router/commentsRouter.js";
import userRouter from "./router/userRouter.js";
import cookieParser from "cookie-parser";

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/api/newsdata", newsRouter);
app.use("/api/comment", commentsRouter);
app.use("/api/user", userRouter);

if (process.env.NODE_ENV == "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("server is ready"));
}
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
