import mongoose from "mongoose";

const newsDataSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add the Article's title"],
    },
    content: {
      type: String,
      required: [true, "Please add the Article's title"],
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      username: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image: {
      type: String, // Assuming you store the image URL or file path as a string
      // required: true,
      default: null,
    },
    categories: {
      type: String,
      required: [true, "Please add the Article's title"],
    },
    comments: [
      {
        user: {
          type: String,
        },
        comment: {
          type: String,
        },
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", newsDataSchema);

export { News };
