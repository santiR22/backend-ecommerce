import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { validateMongoId } from "../utils/validateMongoId.js";

export const create_blog = asyncHandler(async (req, res) => {
  try {
    const new_blog = await Blog.create(req.body);
    res.json(new_blog);
  } catch (error) {
    throw new Error(error);
  }
});

export const update_blog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  }
});

export const delete_blog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const deleted_blog = await Blog.findByIdAndDelete(id);
    res.json(deleted_blog);
  } catch (error) {
    throw new Error(error);
  }
});

export const get_blog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { num_views: 1 },
      },
      { new: true }
    );

    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

export const get_blogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

export const like_blog = asyncHandler(async (req, res) => {
  const { blog_id } = req.body;
  validateMongoId(blog_id);

  //Find the blog wich you want to be liked...
  const blog = await Blog.findById(blog_id);

  //find the login user...
  const login_user_id = req?.user?._id;
  console.log(login_user_id);
  //find if the user has liked the post...
  const is_liked = blog?.is_liked;

  //find the user if has disliked the blog...
  const already_disliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === login_user_id?.toString()
  );

  if (already_disliked) {
    const blog = await Blog.findByIdAndUpdate(
      blog_id,
      {
        $pull: { dislikes: login_user_id },
        is_disliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (is_liked) {
    const blog = await Blog.findByIdAndUpdate(
      blog_id,
      {
        $pull: { likes: login_user_id },
        is_liked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blog_id,
      {
        $push: { likes: login_user_id },
        is_liked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

export const dislike_blog = asyncHandler(async (req, res) => {
  const { blog_id } = req.body;
  validateMongoId(blog_id);

  //Find the blog wich you want to be liked...
  const blog = await Blog.findById(blog_id);

  //find the login user...
  const login_user_id = req?.user?._id;

  //find if the user has liked the post...
  const is_disliked = blog?.is_disliked;

  //find the user if has disliked the blog...
  const already_liked = blog?.likes?.find(
    (userId) => userId?.toString() === login_user_id?.toString()
  );

  if (already_liked) {
    const blog = await Blog.findByIdAndUpdate(
      blog_id,
      {
        $pull: { likes: login_user_id },
        is_liked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (is_disliked) {
    const blog = await Blog.findByIdAndUpdate(
      blog_id,
      {
        $pull: { dislikes: login_user_id },
        is_disliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blog_id,
      {
        $push: { dislikes: login_user_id },
        is_disliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});
