import express from "express";
import {
  createComment,
  updateLikes,
  updateUnlike,
} from "../controllers/newsControllers.js";

const router = express.Router();
router.route("/:newsId/comment").put(createComment).put(updateLikes);
router.route("/:newsId/likes").put(updateLikes);
router.route("/:newsId/unlikes").put(updateUnlike);
export default router;
