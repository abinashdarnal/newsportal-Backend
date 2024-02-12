import express from "express";
import validatedToken from "./../middleware/validatedTokenHandler.js";
import {
  getAllNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsControllers.js";
import upload from "../../backend/multerConfig.js";

const router = express.Router();

router.use(validatedToken);
router.route("/").get(getAllNews).post(createNews);
router.route("/:id").get(getNews).put(updateNews).delete(deleteNews);

export default router;
