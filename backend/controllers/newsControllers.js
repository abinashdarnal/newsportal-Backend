import expressAsyncHandler from "express-async-handler";
import { News } from "../model/newsModel.js";
import User from "../model/usermodel.js";
//@dec Get all News
//@router Get /api/newsdata
//@access Private
const getAllNews = expressAsyncHandler(async (req, res) => {
  const news = await News.find();
  res.status(200).json(news);
});

//@dec Get News
//@router Get /api/newsdata/:id
//@access Private
const getNews = expressAsyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    res.status(404);
    throw new Error("News not Found");
  }
  res.status(200).json(news);
});

//@dec Create all News
//@router Create /api/newsdata
//@access Private
const createNews = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const { title, content, author, image, categories } = req.body;
  if (!title || !content || !categories) {
    res.status(400);
    throw new Error("All fill are mandotary");
  }

  const user = await User.findById(req.user.id).select("username");

  const news = await News.create({
    user_id: req.user.id,
    title,
    content,
    image,
    author: {
      id: user._id,
      username: user.username,
    },
    categories,
  });

  res.status(200).json(news);
});

//@dec Update News
//@router Update /api/newsdata/:id
//@access Private
const updateNews = expressAsyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    res.status(404);
    throw new Error("News not Found");
  }
  if (news.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user News");
  }
  // const user = await User.findById(news.author.id);
  const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedNews);
});
//@dec Delete all News
//@router Delete /api/newsdata/:id
//@access Private
const deleteNews = expressAsyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    res.status(404);
    throw new Error("News not Found");
  }
  if (news.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user News");
  }
  const deletedNews = await News.findByIdAndDelete(req.params.id);
  console.log(news);
  res.status(200).json(deletedNews);
});

const createComment = expressAsyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) {
    res.status(404);
    throw new Error("News not Found");
  }

  const { user, comment } = req.body;

  if (!user || !comment) {
    res.status(400);
    throw new Error("enter your name and comment from it!!");
  }
  const newComment = {
    user,
    comment,
  };

  news.comments.push(newComment);

  await news.save();

  res.status(200).json(news);
});

const updateLikes = expressAsyncHandler(async (req, res) => {
  const newsId = req.params.id;

  const news = await News.findById(newsId);

  if (!news) {
    res.status(404);
    throw new Error("News not found");
  }

  // Update likes
  news.likes += 1;

  const updatedNews = await news.save();

  res.status(200).json(updatedNews);
});

const updateUnlike = expressAsyncHandler(async (req, res) => {
  const newsId = req.params.id;

  const news = await News.findById(newsId);

  if (!news) {
    res.status(404);
    throw new Error("News not found");
  }

  // Update likes
  if (news.likes > 0) {
    news.likes -= 1;
  }

  const updatedNews = await news.save();

  res.status(200).json(updatedNews);
});

export {
  getAllNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  createComment,
  updateLikes,
  updateUnlike,
};
