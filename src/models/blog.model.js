import { Schema, model } from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const blog_schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    num_views: {
      type: Number,
      default: 0,
    },
    is_liked: {
      type: Boolean,
      default: false,
    },
    is_disliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default:
        "https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-1029506242",
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//Export the model
export default model("Blog", blog_schema);
